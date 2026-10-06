let canvas = null;
let ctx = null;
let siteData = null;
let collision = null;
let activeLocation = null;
let sites = [];
let title = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	width: 0,
	height: 0,
	lineGap: 4,
	lines: [
		{text: "JayVanDo.com", fontSize: 48, lineHeight: 48, width: 0},
		{text: "", fontSize: 20, lineHeight: 20, width: 0}
	],
	color: [245, 243, 124]
};
let width = 0;
let height = 0;
let dialRadius = 66.7;
let hoveredDial = -1;
let hoveredControl = -1;
let lastTime = 0;
let started = false;
let boundaryEdges = [];
let lastTextSpeedSetting = 0;
let controlMarks = [];
let controlLabels = [];
let controlMarkRadius = 0;
let controlActiveMarkRadius = 0;
let controlHitRadius = 0;
let controlLabelFontSize = 0;
let rightUiColor = [140, 160, 180];

const boundaryCutRatio = 0.24;
const dialBottomMargin = 0;
const titleMargin = 12;
const titleBottomMargin = 0;
const safeEdge = 34;
const settleForce = 5.5;
const settleDamping = 2.6;
const restSpeed = 7;
const activationSpeed = 5;
const ballGap = 4;
const ballTextGap = 1;
const minCanvasSize = 320;
const minDialRadius = 55.5;
const maxDialRadius = 84.6;
const dialRadiusRatio = 0.0992;
const minTitleFontSize = 30;
const maxTitleFontSize = 62;
const titleFontRatio = 0.055;
const maxFrameTime = 0.033;

const controlDefs = [
	{key: "textSpeed", label: "Text Speed", steps: [85, 98, 110], corner: "tl"},
	{key: "textMass", label: "Mass", steps: [1.5, 2, 2.5], corner: "bl"},
	{key: "textBounce", label: "Bounce", steps: [0.8, 1, 1.2], corner: "bl"},
	{key: "stopAfter", label: "Stop", steps: [4, 6, 8], corner: "tr"},
	{key: "colorBounces", label: "Color", steps: [4, 6, 8], corner: "tr"},
	{key: "ballMass", label: "Mass", steps: [0.75, 1, 1.25], corner: "br"},
	{key: "ballBounce", label: "Bounce", steps: [0.85, 0.90, 0.95], corner: "br"}
];

function siteUrl(site){
	const origin = activeLocation.origin || location.origin;
	return `${origin}${activeLocation.basePath}${site.path}`;
}

function controlAt(x, y){
	for(let controlIdx = 0; controlIdx < controlMarks.length; controlIdx++){
		for(let stepIdx = 0; stepIdx < controlMarks[controlIdx].length; stepIdx++){
			const mark = controlMarks[controlIdx][stepIdx];
			if(Math.hypot(x - mark.x, y - mark.y) <= controlHitRadius) return {controlIdx: controlIdx, stepIdx: stepIdx};
		}
	}

	return null;
}

function buildBoundary(){
	const cut = Math.min(width, height) * boundaryCutRatio;
	const cutX = cut;
	const cutY = cut;
	const points = [
		{x: cutX, y: 0},
		{x: width - cutX, y: 0},
		{x: width, y: cutY},
		{x: width, y: height - cutY},
		{x: width - cutX, y: height},
		{x: cutX, y: height},
		{x: 0, y: height - cutY},
		{x: 0, y: cutY}
	];

	boundaryEdges = [];

	for(let i = 0; i < points.length; i++){
		const a = points[i];
		const b = points[(i + 1) % points.length];
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const edgeLength = Math.hypot(dx, dy);
		const nx = -dy / edgeLength;
		const ny = dx / edgeLength;

		boundaryEdges.push({nx: nx, ny: ny, c: nx * a.x + ny * a.y});
	}
}

function dialEdgeClearance(site, edge){
	const bottomMargin = Math.max(0, -edge.ny) * dialBottomMargin;
	return edge.nx * site.x + edge.ny * site.y - edge.c - dialRadius - bottomMargin;
}

function dialPositionInside(x, y){
	return boundaryEdges.every(edge => {
		const bottomMargin = Math.max(0, -edge.ny) * dialBottomMargin;
		return edge.nx * x + edge.ny * y >= edge.c + dialRadius + bottomMargin;
	});
}

function constrainDial(site, reflect){
	let edgeHit = false;

	for(let pass = 0; pass < 2; pass++){
		for(let edge of boundaryEdges){
			const bottomMargin = Math.max(0, -edge.ny) * dialBottomMargin;
			const required = edge.c + dialRadius + bottomMargin;
			const current = edge.nx * site.x + edge.ny * site.y;
			const penetration = required - current;

			if(penetration <= 0) continue;

			site.x += edge.nx * penetration;
			site.y += edge.ny * penetration;
			edgeHit = true;

			if(reflect){
				const towardOutside = site.vx * edge.nx + site.vy * edge.ny;

				if(towardOutside < 0){
					site.vx -= (1 + collision.ball.bounciness) * towardOutside * edge.nx;
					site.vy -= (1 + collision.ball.bounciness) * towardOutside * edge.ny;
				}
			}
		}
	}

	return edgeHit;
}

function constrainTitle(reflect){
	for(let pass = 0; pass < 2; pass++){
		for(let edge of boundaryEdges){
			const halfTextW = title.width / 2;
			const halfTextH = title.height / 2;
			const titleExtent = Math.abs(edge.nx) * halfTextW + Math.abs(edge.ny) * halfTextH;
			const margin = titleMargin + Math.max(0, -edge.ny) * titleBottomMargin;
			const required = edge.c + titleExtent + margin;
			const current = edge.nx * title.x + edge.ny * title.y;
			const penetration = required - current;

			if(penetration <= 0) continue;

			title.x += edge.nx * penetration;
			title.y += edge.ny * penetration;

			if(reflect){
				const towardOutside = title.vx * edge.nx + title.vy * edge.ny;

				if(towardOutside < 0){
					title.vx -= (1 + collision.text.bounciness) * towardOutside * edge.nx;
					title.vy -= (1 + collision.text.bounciness) * towardOutside * edge.ny;
				}
			}
		}
	}
}

function resizeCanvas(){
	const oldWidth = width || innerWidth;
	const oldHeight = height || innerHeight;
	const dpr = Math.max(1, window.devicePixelRatio || 1);

	width = Math.max(minCanvasSize, innerWidth);
	height = Math.max(minCanvasSize, innerHeight);

	const cut = Math.min(width, height) * boundaryCutRatio;

	canvas.width = Math.round(width * dpr);
	canvas.height = Math.round(height * dpr);
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	dialRadius = Math.max(minDialRadius, Math.min(maxDialRadius, Math.min(width, height) * dialRadiusRatio));
	title.width = 0;
	title.height = 0;

	let visibleTitleLines = 0;

	for(const line of title.lines){
		line.width = 0;

		if(!line.text) continue;

		ctx.font = `600 ${line.fontSize}px Arial, sans-serif`;
		line.width = ctx.measureText(line.text).width;

		title.width = Math.max(title.width, line.width);
		title.height += line.lineHeight;
		visibleTitleLines++;
	}

	if(visibleTitleLines > 1) title.height += title.lineGap * (visibleTitleLines - 1);

	buildBoundary();

	controlMarks = Array.from({length: controlDefs.length}, () => []);
	controlLabels = Array.from({length: controlDefs.length}, () => ({x: 0, y: 0, angle: 0}));

	const setControl = (controlIdx, startX, startY, endX, endY, labelX, labelY, angle) => {
		for(let i = 0; i < 3; i++){
			const t = i / 2;

			controlMarks[controlIdx].push({
				x: startX + (endX - startX) * t,
				y: startY + (endY - startY) * t
			});
		}

		controlLabels[controlIdx] = {x: labelX, y: labelY, angle: angle};
	};

	setControl(
		0,
		cut * 0.18,
		cut * 0.68,
		cut * 0.68,
		cut * 0.18,
		cut * 0.27,
		cut * 0.23,
		-Math.PI / 4
	);

	setControl(
		1,
		cut * 0.18,
		height - cut * 0.68,
		cut * 0.68,
		height - cut * 0.18,
		cut * 0.18,
		height - cut * 0.16,
		Math.PI / 4
	);

	setControl(
		2,
		cut * 0.10,
		height - cut * 0.47,
		cut * 0.47,
		height - cut * 0.10,
		cut * 0.16,
		height - cut * 0.52,
		Math.PI / 4
	);

	setControl(
		3,
		width - cut * 0.68,
		cut * 0.18,
		width - cut * 0.18,
		cut * 0.68,
		width - cut * 0.18,
		cut * 0.16,
		Math.PI / 4
	);

	setControl(
		4,
		width - cut * 0.47,
		cut * 0.10,
		width - cut * 0.10,
		cut * 0.47,
		width - cut * 0.16,
		cut * 0.52,
		Math.PI / 4
	);

	setControl(
		5,
		width - cut * 0.18,
		height - cut * 0.68,
		width - cut * 0.68,
		height - cut * 0.18,
		width - cut * 0.18,
		height - cut * 0.16,
		-Math.PI / 4
	);

	setControl(
		6,
		width - cut * 0.10,
		height - cut * 0.47,
		width - cut * 0.47,
		height - cut * 0.10,
		width - cut * 0.16,
		height - cut * 0.52,
		-Math.PI / 4
	);

	controlMarkRadius = Math.max(4, cut * 0.035);
	controlActiveMarkRadius = controlMarkRadius * 1.4;
	controlHitRadius = Math.max(12, cut * 0.075);
	controlLabelFontSize = Math.max(10, Math.min(17, cut * 0.075));

	if(!started){
		title.x = width * 0.25;
		title.y = height * 0.48;

		sites.forEach(site => {
			site.x = width * site.homeX;
			site.y = height * site.homeY;
			site.vx = 0;
			site.vy = 0;
			site.edgeBounces = collision.stopAfterBounce - 1;
			site.motion = "rest";
			site.hitColor = [...site.color];
		});

		started = true;
	}else{
		title.x = title.x * width / oldWidth;
		title.y = title.y * height / oldHeight;

		sites.forEach(site => {
			site.x = site.x * width / oldWidth;
			site.y = site.y * height / oldHeight;
		});
	}

	constrainTitle(false);

	sites.forEach(site => { constrainDial(site, false); });
}

function update(dt){
	if(collision.text.speed !== lastTextSpeedSetting){
		const currentSpeed = Math.hypot(title.vx, title.vy);

		if(currentSpeed > 0.001){
			title.vx = title.vx / currentSpeed * collision.text.speed;
			title.vy = title.vy / currentSpeed * collision.text.speed;
		}else{
			title.vx = collision.text.startDirection.x * collision.text.speed;
			title.vy = collision.text.startDirection.y * collision.text.speed;
		}

		lastTextSpeedSetting = collision.text.speed;
	}

	title.x += title.vx * dt;
	title.y += title.vy * dt;

	const halfTextW = title.width / 2;
	const halfTextH = title.height / 2;

	constrainTitle(true);

	sites.forEach(site => {
		if(site.motion === "rest"){
			site.vx = 0;
			site.vy = 0;
			return;
		}

		if(site.motion === "settle"){
			let ax = 0;
			let ay = 0;

			for(let edge of boundaryEdges){
				const clearance = dialEdgeClearance(site, edge);

				if(clearance < safeEdge){
					const force = (safeEdge - clearance) * settleForce;
					ax += edge.nx * force;
					ay += edge.ny * force;
				}
			}

			site.vx += ax * dt;
			site.vy += ay * dt;

			const damping = Math.exp(-settleDamping * dt);

			site.vx *= damping;
			site.vy *= damping;
		}

		site.x += site.vx * dt;
		site.y += site.vy * dt;

		const edgeHit = constrainDial(site, true);

		if(edgeHit && site.motion === "active") site.edgeBounces++;
		if(site.motion === "active" && site.edgeBounces >= collision.stopAfterBounce) site.motion = "settle";

		if(site.motion === "settle"){
			const clearEdge = boundaryEdges.every(edge => dialEdgeClearance(site, edge) >= safeEdge - 2);

			if(clearEdge && Math.hypot(site.vx, site.vy) < restSpeed){
				site.vx = 0;
				site.vy = 0;
				site.motion = "rest";
			}
		}
	});

	for(let i = 0; i < sites.length; i++){
		for(let j = i + 1; j < sites.length; j++){
			const a = sites[i];
			const b = sites[j];
			const dx = b.x - a.x;
			const dy = b.y - a.y;
			const dist = Math.max(0.001, Math.hypot(dx, dy));
			const minDist = dialRadius * 2 + ballGap;

			if(dist >= minDist) continue;

			const nx = dx / dist;
			const ny = dy / dist;
			const overlap = minDist - dist;

			a.x -= nx * overlap / 2;
			a.y -= ny * overlap / 2;
			b.x += nx * overlap / 2;
			b.y += ny * overlap / 2;

			constrainDial(a, false);
			constrainDial(b, false);

			const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;

			if(rel < 0){
				const invMass = 1 / collision.ball.mass;
				const impulse = -(1 + collision.ball.bounciness) * rel / (invMass + invMass);

				a.vx -= nx * impulse * invMass;
				a.vy -= ny * impulse * invMass;
				b.vx += nx * impulse * invMass;
				b.vy += ny * impulse * invMass;

				if(a.motion === "rest" && Math.hypot(a.vx, a.vy) > activationSpeed){
					a.motion = "active";
					a.edgeBounces = 0;
				}

				if(b.motion === "rest" && Math.hypot(b.vx, b.vy) > activationSpeed){
					b.motion = "active";
					b.edgeBounces = 0;
				}

				a.hitColor = [...b.color];
				b.hitColor = [...a.color];
				a.edgeBounces = 0;
				b.edgeBounces = 0;
			}
		}
	}

	for(let pass = 0; pass < 2; pass++){
		for(let i = 0; i < sites.length; i++){
			const site = sites[i];
			const left = title.x - halfTextW;
			const right = title.x + halfTextW;
			const top = title.y - halfTextH;
			const bottom = title.y + halfTextH;
			const nearX = Math.max(left, Math.min(site.x, right));
			const nearY = Math.max(top, Math.min(site.y, bottom));

			let dx = site.x - nearX;
			let dy = site.y - nearY;
			let dist = Math.hypot(dx, dy);
			let nx = 0;
			let ny = 0;
			let overlap = 0;

			if(dist >= dialRadius) continue;

			if(dist > 0.001){
				nx = dx / dist;
				ny = dy / dist;
				overlap = dialRadius - dist;
			}else{
				const gaps = [site.x - left, right - site.x, site.y - top, bottom - site.y];
				const side = gaps.indexOf(Math.min(...gaps));

				if(side === 0){
					nx = -1;
					overlap = dialRadius + gaps[0];
				}

				if(side === 1){
					nx = 1;
					overlap = dialRadius + gaps[1];
				}

				if(side === 2){
					ny = -1;
					overlap = dialRadius + gaps[2];
				}

				if(side === 3){
					ny = 1;
					overlap = dialRadius + gaps[3];
				}
			}

			const moveX = site.x + nx * (overlap + ballTextGap);
			const moveY = site.y + ny * (overlap + ballTextGap);

			let canMove = dialPositionInside(moveX, moveY);

			if(canMove){
				for(let j = 0; j < sites.length; j++){
					if(j === i) continue;

					if(Math.hypot(moveX - sites[j].x, moveY - sites[j].y) < dialRadius * 2 + 2){
						canMove = false;
						break;
					}
				}
			}

			if(canMove){
				site.x = moveX;
				site.y = moveY;
			}else{
				title.x -= nx * (overlap + ballTextGap);
				title.y -= ny * (overlap + ballTextGap);
				constrainTitle(false);
			}

			const rel = (site.vx - title.vx) * nx + (site.vy - title.vy) * ny;

			if(rel < 0){
				const ballInvMass = 1 / collision.ball.mass;
				const textInvMass = 1 / collision.text.mass;
				const bounciness = Math.min(collision.ball.bounciness, collision.text.bounciness);
				const impulse = -(1 + bounciness) * rel / (ballInvMass + textInvMass);

				site.vx += nx * impulse * ballInvMass;
				site.vy += ny * impulse * ballInvMass;
				title.vx -= nx * impulse * textInvMass;
				title.vy -= ny * impulse * textInvMass;

				const speed = Math.hypot(site.vx, site.vy);

				if(speed > collision.ball.maxSpeed){
					site.vx *= collision.ball.maxSpeed / speed;
					site.vy *= collision.ball.maxSpeed / speed;
				}

				site.edgeBounces = 0;
				site.motion = "active";
				site.hitColor = [...title.color];
			}
		}
	}

	const titleSpeed = Math.hypot(title.vx, title.vy);

	if(titleSpeed > 0){
		title.vx = title.vx / titleSpeed * collision.text.speed;
		title.vy = title.vy / titleSpeed * collision.text.speed;
	}
}

function draw(){
	const cut = Math.min(width, height) * boundaryCutRatio;
	const cutX = cut;
	const cutY = cut;
	const titleColor = `rgb(${title.color[0]}, ${title.color[1]}, ${title.color[2]})`;
	const rightColor = `rgb(${rightUiColor[0]}, ${rightUiColor[1]}, ${rightUiColor[2]})`;
	const rightBrightness = rightUiColor[0] * 0.299 + rightUiColor[1] * 0.587 + rightUiColor[2] * 0.114;
	const rightTextColor = rightBrightness < 120 ? "#fff" : "#111";

	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, width, height);

	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(cutX, 0);
	ctx.lineTo(0, cutY);
	ctx.closePath();
	ctx.fillStyle = titleColor;
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(0, height);
	ctx.lineTo(0, height - cutY);
	ctx.lineTo(cutX, height);
	ctx.closePath();
	ctx.fillStyle = titleColor;
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(width, 0);
	ctx.lineTo(width - cutX, 0);
	ctx.lineTo(width, cutY);
	ctx.closePath();
	ctx.fillStyle = rightColor;
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(width, height);
	ctx.lineTo(width, height - cutY);
	ctx.lineTo(width - cutX, height);
	ctx.closePath();
	ctx.fillStyle = rightColor;
	ctx.fill();

	const drawControl = controlIdx => {
		const control = controlDefs[controlIdx];
		const marks = controlMarks[controlIdx];
		const isLeft = control.corner === "tl" || control.corner === "bl";
		const controlTextColor = isLeft ? "#111" : rightTextColor;

		ctx.beginPath();
		ctx.moveTo(marks[0].x, marks[0].y);
		ctx.lineTo(marks[2].x, marks[2].y);
		ctx.lineWidth = Math.max(2, controlMarkRadius * 0.35);
		ctx.strokeStyle = controlTextColor;
		ctx.stroke();

		let currentValue = 0;

		if(control.key === "textSpeed") currentValue = collision.text.speed;
		if(control.key === "textMass") currentValue = collision.text.mass;
		if(control.key === "textBounce") currentValue = collision.text.bounciness;
		if(control.key === "ballMass") currentValue = collision.ball.mass;
		if(control.key === "ballBounce") currentValue = collision.ball.bounciness;
		if(control.key === "colorBounces") currentValue = collision.colorChangeBounceCount;
		if(control.key === "stopAfter") currentValue = collision.stopAfterBounce;

		let activeStep = 0;
		let activeDiff = Infinity;

		for(let i = 0; i < control.steps.length; i++){
			const diff = Math.abs(currentValue - control.steps[i]);

			if(diff < activeDiff){
				activeDiff = diff;
				activeStep = i;
			}
		}

		for(let i = 0; i < marks.length; i++){
			ctx.beginPath();
			ctx.arc(marks[i].x, marks[i].y, i === activeStep ? controlActiveMarkRadius : controlMarkRadius, 0, Math.PI * 2);
			ctx.fillStyle = controlTextColor;
			ctx.fill();
		}

		ctx.save();
		ctx.translate(controlLabels[controlIdx].x, controlLabels[controlIdx].y);
		ctx.rotate(controlLabels[controlIdx].angle);
		ctx.font = `600 ${controlLabelFontSize}px Arial, sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = controlTextColor;
		ctx.fillText(control.label, 0, 0);
		ctx.restore();
	};

	for(let controlIdx = 0; controlIdx < controlDefs.length; controlIdx++) drawControl(controlIdx);

	ctx.beginPath();
	ctx.moveTo(cutX, 0);
	ctx.lineTo(width - cutX, 0);
	ctx.lineTo(width, cutY);
	ctx.lineTo(width, height - cutY);
	ctx.lineTo(width - cutX, height);
	ctx.lineTo(cutX, height);
	ctx.lineTo(0, height - cutY);
	ctx.lineTo(0, cutY);
	ctx.closePath();

	ctx.lineWidth = 3;
	ctx.strokeStyle = titleColor;
	ctx.stroke();

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = titleColor;

	const visibleTitleLines = title.lines.filter(line => line.text);
	let titleY = title.y - title.height / 2;

	for(let i = 0; i < visibleTitleLines.length; i++){
		const line = visibleTitleLines[i];

		titleY += line.lineHeight / 2;
		ctx.font = `600 ${line.fontSize}px Arial, sans-serif`;
		ctx.fillText(line.text, title.x, titleY);
		titleY += line.lineHeight / 2;

		if(i < visibleTitleLines.length - 1) titleY += title.lineGap;
	}

	sites.forEach((site, idx) => {
		const recoveryBounces = Math.max(0, site.edgeBounces - 1);
		const recoverySteps = Math.max(1, collision.colorChangeBounceCount - 1);
		const mix = Math.max(0, 1 - Math.min(recoverySteps, recoveryBounces) / recoverySteps);

		const r = Math.round(site.color[0] + (site.hitColor[0] - site.color[0]) * mix);
		const g = Math.round(site.color[1] + (site.hitColor[1] - site.color[1]) * mix);
		const b = Math.round(site.color[2] + (site.hitColor[2] - site.color[2]) * mix);
		const brightness = r * 0.299 + g * 0.587 + b * 0.114;

		ctx.beginPath();
		ctx.arc(site.x, site.y, dialRadius, 0, Math.PI * 2);

		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
		ctx.fill();

		ctx.lineWidth = idx === hoveredDial ? 5 : 3;
		ctx.strokeStyle = idx === hoveredDial ? titleColor : "#111";
		ctx.stroke();

		ctx.fillStyle = brightness < 120 ? "#fff" : "#111";
		ctx.font = `600 ${site.name.length > 8 ? Math.max(12, dialRadius * 0.23) : Math.max(16, dialRadius * 0.34)}px Arial, sans-serif`;

		ctx.fillText(site.name, site.x, site.y);
	});
}

function animate(now){
	const dt = Math.min(maxFrameTime, Math.max(0, (now - lastTime) / 1000 || 0));

	lastTime = now;

	update(dt);
	draw();

	requestAnimationFrame(animate);
}

async function init(){
	canvas = document.getElementById("portalCanvas");
	ctx = canvas.getContext("2d");

	try{
		const [siteResponse, collisionResponse] = await Promise.all([
			fetch("siteData.json", {cache: "no-store"}),
			fetch("collisionDefaults.json", {cache: "no-store"})
		]);

		if(!siteResponse.ok) throw new Error(`siteData.json: HTTP ${siteResponse.status}`);
		if(!collisionResponse.ok) throw new Error(`collisionDefaults.json: HTTP ${collisionResponse.status}`);

		siteData = await siteResponse.json();
		collision = await collisionResponse.json();
	}catch(error){
		console.error(`Portal configuration error: ${error.message}`, error);
		return;
	}

	const locationName = Object.keys(siteData.locations).find(name => siteData.locations[name].hosts.includes(location.hostname)) || siteData.defaultLocation;

	activeLocation = siteData.locations[locationName];
	sites = siteData.sites.map(site => ({...site}));

	if(sites.length > 0){
		let r = 0;
		let g = 0;
		let b = 0;

		sites.forEach(site => {
			r += site.color[0];
			g += site.color[1];
			b += site.color[2];
		});

		rightUiColor = [
			Math.round(r / sites.length),
			Math.round(g / sites.length),
			Math.round(b / sites.length)
		];
	}

	const directionLength = Math.max(0.001, Math.hypot(collision.text.startDirection.x, collision.text.startDirection.y));

	title.vx = collision.text.startDirection.x / directionLength * collision.text.speed;
	title.vy = collision.text.startDirection.y / directionLength * collision.text.speed;

	lastTextSpeedSetting = collision.text.speed;

	canvas.addEventListener("pointermove", event => {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const controlHit = controlAt(x, y);

		if(controlHit){
			hoveredControl = controlHit.controlIdx;
			hoveredDial = -1;
			canvas.style.cursor = "pointer";
			return;
		}

		hoveredControl = -1;
		hoveredDial = sites.findIndex(site => Math.hypot(x - site.x, y - site.y) <= dialRadius);
		canvas.style.cursor = hoveredDial >= 0 ? "pointer" : "default";
	});

	canvas.addEventListener("pointerleave", () => {
		hoveredControl = -1;
		hoveredDial = -1;
		canvas.style.cursor = "default";
	});

	canvas.addEventListener("click", event => {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const controlHit = controlAt(x, y);

		if(controlHit){
			const control = controlDefs[controlHit.controlIdx];
			const value = control.steps[controlHit.stepIdx];

			if(control.key === "textSpeed") collision.text.speed = value;
			if(control.key === "textMass") collision.text.mass = value;
			if(control.key === "textBounce") collision.text.bounciness = value;
			if(control.key === "ballMass") collision.ball.mass = value;
			if(control.key === "ballBounce") collision.ball.bounciness = value;
			if(control.key === "colorBounces") collision.colorChangeBounceCount = value;
			if(control.key === "stopAfter") collision.stopAfterBounce = value;

			return;
		}

		const idx = sites.findIndex(site => Math.hypot(x - site.x, y - site.y) <= dialRadius);

		if(idx >= 0) window.open(siteUrl(sites[idx]), "_blank", "noopener");
	});

	window.addEventListener("resize", resizeCanvas);

	title.lines[1].text = location.hostname.endsWith("jayvando.com") ? "" : location.hostname;

	resizeCanvas();

	requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", init);