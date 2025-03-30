import * as THREE from 'three';
import gsap from 'gsap';

// Set up the scene
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0000ff, 1); // Blue background
document.body.appendChild(renderer.domElement);

// Set up an orthographic camera
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 1.5;
const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    10
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);
scene.add(camera);

const frontMaterial = new THREE.MeshBasicMaterial({ color: 0xffccaa, side: THREE.DoubleSide });
const backMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

frontMaterial.depthTest = false;
backMaterial.depthTest = false;

frontMaterial.transparent = true;
frontMaterial.alphaTest = 0.5;
backMaterial.transparent = true;
backMaterial.alphaTest = 0.5;


const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
    -0.5,  0.5, 0,  
     0.5,  0.5, 0,  
    -0.5, -0.5, 0,  

     0.5,  0.5, 0,  
     0.5, -0.5, 0,  
    -0.5, -0.5, 0   
]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const paperGroup = new THREE.Group();
const frontMesh = new THREE.Mesh(geometry, frontMaterial);
const backMesh = new THREE.Mesh(geometry, backMaterial);
backMesh.position.z = -0.01; 
paperGroup.add(frontMesh);
paperGroup.add(backMesh);

paperGroup.rotation.z = Math.PI / 4; 
scene.add(paperGroup);

function foldStep1() {
    scene.remove(paperGroup);

    const leftGeometry = new THREE.BufferGeometry();
    leftGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0,  0.7071, 0,  
        0, -0.7071, 0,  
       -0.7071, 0, 0    
    ]), 3));

    const rightGeometry = new THREE.BufferGeometry();
    rightGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0,  0.7071, 0,  
        0, -0.7071, 0,  
        0.7071, 0, 0    
    ]), 3));

    const leftGroup = new THREE.Group();
    const leftFrontMesh = new THREE.Mesh(leftGeometry, frontMaterial);
    const leftBackMesh = new THREE.Mesh(leftGeometry, backMaterial);
    leftBackMesh.position.z = -0.01;
    leftGroup.add(leftFrontMesh, leftBackMesh);
    scene.add(leftGroup);

    const rightGroup = new THREE.Group();
    const rightFrontMesh = new THREE.Mesh(rightGeometry, frontMaterial);
    const rightBackMesh = new THREE.Mesh(rightGeometry, backMaterial);
    rightBackMesh.position.z = -0.01;
    rightGroup.add(rightFrontMesh, rightBackMesh);
    scene.add(rightGroup);

    gsap.to(leftGroup.rotation, {
        duration: 1,
        y: Math.PI,
        onComplete: () => {
            gsap.to(leftGroup.rotation, {
                duration: 1,
                y: 0,
                onComplete: () => {
                    scene.remove(leftGroup, rightGroup);
                    scene.add(paperGroup);

                    foldStep2();
                }
            });
        }
    });
}

function foldStep2() {
  scene.remove(paperGroup);

  const topGeometry = new THREE.BufferGeometry();
  topGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0,  0.7071, 0,     // Top point (0, 0.5) rotated 45 degrees
     -0.7071, 0, 0,      // Left point (-0.5, 0) rotated 45 degrees
      0.7071, 0, 0       // Right point (0.5, 0) rotated 45 degrees
  ]), 3));

  // Bottom half of the rhombus
  const bottomGeometry = new THREE.BufferGeometry();
  bottomGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0, -0.7071, 0,     // Bottom point (0, -0.5) rotated 45 degrees
     -0.7071, 0, 0,      // Left point (-0.5, 0) rotated 45 degrees
      0.7071, 0, 0       // Right point (0.5, 0) rotated 45 degrees
  ]), 3));

  const topGroup = new THREE.Group();
  const topFrontMesh = new THREE.Mesh(topGeometry, frontMaterial);
  const topBackMesh = new THREE.Mesh(topGeometry, backMaterial);
  topBackMesh.position.z = -0.02;
  topGroup.add(topFrontMesh, topBackMesh);
  scene.add(topGroup);

  const bottomGroup = new THREE.Group();
  const bottomFrontMesh = new THREE.Mesh(bottomGeometry, frontMaterial);
  const bottomBackMesh = new THREE.Mesh(bottomGeometry, backMaterial);
  bottomBackMesh.position.z = -0.02;
  bottomGroup.add(bottomFrontMesh, bottomBackMesh);
  scene.add(bottomGroup);


  gsap.to(topGroup.rotation, {
      duration: 1,
      x: Math.PI, 
      onComplete: () => {
        gsap.to(topGroup.rotation, {
            duration: 1,
            x: 0,
            onComplete: () => {
                scene.remove(topGroup, bottomGroup);
                scene.add(paperGroup);
                
                foldstep3();
            }
        });
    }
  });
}

function foldstep3() {
    scene.remove(paperGroup);

    const upperTopGeometry = new THREE.BufferGeometry();
    upperTopGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0.7071, 0,        // Top vertex
        -0.35355, 0.35355, 0, // Left fold line vertex
        0.35355, 0.35355, 0   // Right fold line vertex
    ]), 3));


    const lowerTopGeometry1 = new THREE.BufferGeometry();
    lowerTopGeometry1.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        -0.35355, 0.35355, 0, // Left fold line vertex
        -0.7071, 0, 0,        // Bottom-left vertex
        0.35355, 0.35355, 0   // Right fold line vertex
    ]), 3));

    const lowerTopGeometry2 = new THREE.BufferGeometry();
    lowerTopGeometry2.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0.35355, 0.35355, 0,  // Right fold line vertex
        -0.7071, 0, 0,        // Bottom-left vertex
        0.7071, 0, 0          // Bottom-right vertex
    ]), 3));

    const bottomGeometry = new THREE.BufferGeometry();
    bottomGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, -0.7071, 0,     // Bottom point
        -0.7071, 0, 0,     // Left point
        0.7071, 0, 0       // Right point
    ]), 3));

    const upperGroup = new THREE.Group();
    const upperFrontMesh = new THREE.Mesh(upperTopGeometry, frontMaterial);
    const upperBackMesh = new THREE.Mesh(upperTopGeometry, backMaterial);
    upperBackMesh.position.z = -0.02;
    upperGroup.add(upperFrontMesh, upperBackMesh);

    upperFrontMesh.position.y -= 0.35355; 
    upperBackMesh.position.y -= 0.35355;
    upperGroup.position.y += 0.35355; 
    scene.add(upperGroup);

    const lowerTopGroup = new THREE.Group();
    const lowerTopFrontMesh1 = new THREE.Mesh(lowerTopGeometry1, frontMaterial);
    const lowerTopBackMesh1 = new THREE.Mesh(lowerTopGeometry1, backMaterial);
    lowerTopBackMesh1.position.z = -0.02;
    const lowerTopFrontMesh2 = new THREE.Mesh(lowerTopGeometry2, frontMaterial);
    const lowerTopBackMesh2 = new THREE.Mesh(lowerTopGeometry2, backMaterial);
    lowerTopBackMesh2.position.z = -0.02;
    lowerTopGroup.add(lowerTopFrontMesh1, lowerTopBackMesh1, lowerTopFrontMesh2, lowerTopBackMesh2);
    scene.add(lowerTopGroup);

    const bottomGroup = new THREE.Group();
    const bottomFrontMesh = new THREE.Mesh(bottomGeometry, frontMaterial);
    const bottomBackMesh = new THREE.Mesh(bottomGeometry, backMaterial);
    bottomBackMesh.position.z = -0.02;
    bottomGroup.add(bottomFrontMesh, bottomBackMesh);
    scene.add(bottomGroup);

    gsap.to(upperGroup.rotation, {
        duration: 1,
        x: Math.PI, 
        onUpdate: () => {
            renderer.render(scene, camera);
        },
        onComplete: () => {
            foldStep4();
        }
    });
}

function foldStep4() {
    // Clear the scene of any previous groups to avoid overlap
    scene.children = scene.children.filter(child => child === camera); 

    // Define the geometry for the upper top triangle (same as in foldStep3, already folded)
    const upperTopGeometry = new THREE.BufferGeometry();
    upperTopGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0.7071, 0,         // Top vertex
        -0.35355, 0.35355, 0, // Left fold line vertex
        0.35355, 0.35355, 0   // Right fold line vertex
    ]), 3));

    const lowerTopGeometry1 = new THREE.BufferGeometry();
    lowerTopGeometry1.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        -0.35355, 0.35355, 0, // Left fold line vertex
        -0.7071, 0, 0,        // Bottom-left vertex
        0.35355, 0.35355, 0   // Right fold line vertex
    ]), 3));

    const lowerTopGeometry2 = new THREE.BufferGeometry();
    lowerTopGeometry2.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0.35355, 0.35355, 0,  // Right fold line vertex
        -0.7071, 0, 0,        // Bottom-left vertex
        0.7071, 0, 0          // Bottom-right vertex
    ]), 3));

    // Define the geometry for the bottom triangle with an asymmetric fold line at 1/4 from the bottom
    const lowerBottomGeometry = new THREE.BufferGeometry();
    lowerBottomGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, -0.7071, 0,         // Bottom vertex
        -0.530325, -0.176775, 0, // Left fold line vertex (1/4 from bottom)
        0.530325, -0.176775, 0  // Right fold line vertex (1/4 from bottom)
    ]), 3));

    const upperBottomGeometry1 = new THREE.BufferGeometry();
    upperBottomGeometry1.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        -0.530325, -0.176775, 0, // Left fold line vertex
        -0.7071, 0, 0,          // Top-left vertex
        0.530325, -0.176775, 0  // Right fold line vertex
    ]), 3));

    const upperBottomGeometry2 = new THREE.BufferGeometry();
    upperBottomGeometry2.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0.530325, -0.176775, 0, // Right fold line vertex
        -0.7071, 0, 0,         // Top-left vertex
        0.7071, 0, 0           // Top-right vertex
    ]), 3));

    const upperGroup = new THREE.Group();
    const upperFrontMesh = new THREE.Mesh(upperTopGeometry, frontMaterial);
    const upperBackMesh = new THREE.Mesh(upperTopGeometry, backMaterial);
    upperBackMesh.position.z = -0.02;
    upperGroup.add(upperFrontMesh, upperBackMesh);
    upperGroup.rotation.x = Math.PI; 
    upperFrontMesh.position.y -= 0.35355;
    upperBackMesh.position.y -= 0.35355;
    upperGroup.position.y += 0.35355;
    scene.add(upperGroup);

    // Create the lower top group (the two triangles below the top one)
    const lowerTopGroup = new THREE.Group();
    const lowerTopFrontMesh1 = new THREE.Mesh(lowerTopGeometry1, frontMaterial);
    const lowerTopBackMesh1 = new THREE.Mesh(lowerTopGeometry1, backMaterial);
    lowerTopBackMesh1.position.z = -0.02;
    const lowerTopFrontMesh2 = new THREE.Mesh(lowerTopGeometry2, frontMaterial);
    const lowerTopBackMesh2 = new THREE.Mesh(lowerTopGeometry2, backMaterial);
    lowerTopBackMesh2.position.z = -0.02;
    lowerTopGroup.add(lowerTopFrontMesh1, lowerTopBackMesh1, lowerTopFrontMesh2, lowerTopBackMesh2);
    scene.add(lowerTopGroup);

    // Create the lower bottom group (the bottom triangle to be folded)
    const lowerBottomGroup = new THREE.Group();
    const lowerBottomFrontMesh = new THREE.Mesh(lowerBottomGeometry, frontMaterial);
    const lowerBottomBackMesh = new THREE.Mesh(lowerBottomGeometry, backMaterial);
    lowerBottomBackMesh.position.z = -0.02;
    lowerBottomGroup.add(lowerBottomFrontMesh, lowerBottomBackMesh);
    lowerBottomFrontMesh.position.y += 0.176775; 
    lowerBottomBackMesh.position.y += 0.176775;
    lowerBottomGroup.position.y -= 0.176775;
    scene.add(lowerBottomGroup);

    const upperBottomGroup = new THREE.Group();
    const upperBottomFrontMesh1 = new THREE.Mesh(upperBottomGeometry1, frontMaterial);
    const upperBottomBackMesh1 = new THREE.Mesh(upperBottomGeometry1, backMaterial);
    upperBottomBackMesh1.position.z = -0.02;
    const upperBottomFrontMesh2 = new THREE.Mesh(upperBottomGeometry2, frontMaterial);
    const upperBottomBackMesh2 = new THREE.Mesh(upperBottomGeometry2, backMaterial);
    upperBottomBackMesh2.position.z = -0.02;
    upperBottomGroup.add(upperBottomFrontMesh1, upperBottomBackMesh1, upperBottomFrontMesh2, upperBottomBackMesh2);
    scene.add(upperBottomGroup);

    gsap.to(lowerBottomGroup.rotation, {
        duration: 1,
        x: -Math.PI, // Fold upward 
        onUpdate: () => {
            renderer.render(scene, camera);
        },
        onComplete: () => {
            console.log("Fold complete! The bottom triangle should now overlap the top triangle.");
        }
    });
}

document.addEventListener("click", () => {
    foldStep1();
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
