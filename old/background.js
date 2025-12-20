// Three.js 3D Background with floating text
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg-canvas"),
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 50;

// Function to create text sprites
function createTextSprite(text) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 128;

  ctx.font = "Bold 80px Arial";
  ctx.fillStyle = "#4cba9d";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#4cba9d";
  ctx.shadowBlur = 15;
  ctx.fillText(text, 128, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.7,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(8, 4, 1);
  return sprite;
}

// Words for floating text cloud
const words = ["+27", "+25", "+23", "GG", "NIHAO", "CN", "NIGGA"];
const textCloud = new THREE.Group();

// Create 500 random text sprites
for (let i = 0; i < 500; i++) {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const sprite = createTextSprite(randomWord);

  sprite.position.set(
    (Math.random() - 0.5) * 400,
    (Math.random() - 0.5) * 400,
    (Math.random() - 0.5) * 400
  );

  const randomSize = 5 + Math.random() * 10;
  sprite.scale.set(randomSize, randomSize / 2, 1);

  textCloud.add(sprite);
}

scene.add(textCloud);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  textCloud.rotation.y += 0.0005;
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
