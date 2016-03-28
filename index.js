let width = window.innerWidth;
let height = window.innerHeight;
let frameRate = 1/40;
let canvas = "";
let ctx = "";

let randomstartplacement = false;
let rainbowmode = true;
let letterpushed = false;
let letterlist = [];

const Cd = 0.47;
const rho = 1.22;
const A = Math.PI * 15 * 15 / (10000);
const ag = 9.81; 

const setup = () => {
  canvas = document.getElementsByTagName("canvas")[0];
  ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  window.addEventListener('resize', resizeCanvas, false);
  window.addEventListener('keydown', keyUp, false);
    
  document.getElementById('rainbow').onclick = (e) => {
    rainbowmode = e.currentTarget.checked;
  };

	document.getElementById('startplacement').onclick = (e) => {
    randomstartplacement = e.currentTarget.checked;
	};

  ctx.shadowBlur = 50; 

  initSentence("HELLO PEOPLE! TYPE SOMETHING!");
  loop();
}

const resizeCanvas = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
};

const keyUp = (e) => {
	letterpushed = true;
  let ltr = generateLetter(String.fromCharCode(e.keyCode));
  letterlist.push(ltr);
};

const initSentence = (s) => {
	let sentence = s.split('');
	let i = 0;
	letterpushed = false;
	setInterval(() => {
		if(sentence.length >= i+1 && !letterpushed){
  		let ltr = generateLetter(sentence[i]);
      letterlist.push(ltr);
      i++;
		}
	}, 300);
};

const generateLetter = (value) => {
	return {
    position: {
      x: generateStartPlacement(), 
      y: height
    },
    velocity: {
      x: getRandomArbitrary(-5, 5), 
      y: getRandomArbitrary(-15, -60)
    },
    mass: 0.1,
    radius: 40,
    restitution: -1,
    value: value,
    duration: 400,
    color: generateColor(),
    draw(context, l){
      context.save();
     	context.font="80px monospace";
     	context.shadowColor = l.color;
		  context.fillStyle = l.color;
      context.fillText(l.value, l.position.x, l.position.y);
      context.restore();
    }
	};

};

const generateColor = () =>{
	if (rainbowmode){
		return "#" + Math.random().toString(16).slice(2, 8);
	}
	return "#ffffff";
};

const generateStartPlacement = () =>{
	if (randomstartplacement){
		return getRandomArbitrary(0, width);
	}
	return width / 2;
};

const loop = () => {
	ctx.clearRect(0,0, width, height);
  letterlist.map((ltr) => {
    let Fx = -0.5 * Cd * A * rho * ltr.velocity.x * ltr.velocity.x * ltr.velocity.x / Math.abs(ltr.velocity.x);
    let Fy = -0.5 * Cd * A * rho * ltr.velocity.y * ltr.velocity.y * ltr.velocity.y / Math.abs(ltr.velocity.y);
    
    Fx = (isNaN(Fx) ? 0 : Fx);
    Fy = (isNaN(Fy) ? 0 : Fy);
    
    let ax = Fx / ltr.mass;
    let ay = ag + (Fy / ltr.mass);

    ltr.velocity.x += ax*frameRate;
    ltr.velocity.y += ay*frameRate;
    
    ltr.position.x += ltr.velocity.x*frameRate*100;
    ltr.position.y += ltr.velocity.y*frameRate*100;
    
    if (ltr.position.y > height - ltr.radius) {
      ltr.velocity.y *= ltr.restitution;
      ltr.position.y = height - ltr.radius;
    }

    if (ltr.position.x > width - ltr.radius) {
      ltr.velocity.x *= ltr.restitution;
      ltr.position.x = width - ltr.radius;
    }

    if (ltr.position.x < ltr.radius) {
      ltr.velocity.x *= ltr.restitution;
      ltr.position.x = ltr.radius;
    }

		ltr.draw(ctx, ltr);
		ltr.duration--;
  });

  letterlist = letterlist.filter((ltr) => {
  	return ltr.duration > 0;
  });

  window.requestAnimationFrame(() => {
    loop();
  });
}

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
}

setup();