// import React, { useRef, useEffect, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const OrigamiThree = () => {
//   const mountRef = useRef(null);
//   const [step, setStep] = useState(1);

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(500, 500); // Set fixed size for the canvas
//     mountRef.current.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     camera.position.z = 5;

//     const geometry = new THREE.PlaneGeometry(3, 3);
//     const material = new THREE.MeshBasicMaterial({ color: 0xffa07a, side: THREE.DoubleSide }); // Light coral
//     const paper = new THREE.Mesh(geometry, material);
//     scene.add(paper);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       camera.aspect = 1; // Keep aspect ratio 1:1 since the canvas is fixed
//       camera.updateProjectionMatrix();
//       renderer.setSize(500, 500); // Maintain fixed size
//     };

//     window.addEventListener('resize', handleResize);

//     const handleFold = () => {
//       switch (step) {
//         case 1:
//           paper.rotation.x = Math.PI / 2;
//           break;
//         case 2:
//           paper.rotation.z = Math.PI / 4;
//           break;
//         case 3:
//           paper.rotation.y = Math.PI;
//           break;
//         case 4:
//           paper.rotation.z = Math.PI / 2;
//           break;
//         case 5:
//           paper.rotation.x = 0;
//           break;
//         case 6:
//           paper.scale.set(0.6, 0.6, 1);
//           break;
//         case 7:
//           paper.scale.set(0.6, 0.6, 1);
//           break;
//         case 8:
//           paper.rotation.z = -Math.PI / 4;
//           break;
//         case 9:
//           paper.rotation.z = -Math.PI / 2;
//           break;
//         case 10:
//           paper.rotation.y = 0;
//           break;
//           case 11: { // Add curly braces here
//             // Add spots (simplified)
//             const spotGeometry = new THREE.CircleGeometry(0.2, 32);
//             const spotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
//             const spot1 = new THREE.Mesh(spotGeometry, spotMaterial);
//             const spot2 = new THREE.Mesh(spotGeometry, spotMaterial);
//             spot1.position.set(-0.7, 0.7, 0.1);
//             spot2.position.set(0.7, -0.7, 0.1);
//             paper.add(spot1);
//             paper.add(spot2);
//             break;
//           } // Add curly braces here
//         default:
//           break;
//       }
//       setStep((prevStep) => prevStep + 1);
//     };

//     mountRef.current.addEventListener('click', handleFold);

//     return () => {
//       mountRef.current.removeChild(renderer.domElement);
//       window.removeEventListener('resize', handleResize);
//       mountRef.current.removeEventListener('click', handleFold);
//     };
//   }, [step]);

//   return <div ref={mountRef} className="three-container" style={{ width: '500px', height: '500px' }} />;
// };

// export default OrigamiThree;

import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

/**
 * A geometry class for a rectangular cuboid with a given width, height, and depth.
 * On creation, the cuboid is centred on the origin, with each edge parallel to one
 * of the axes.
 *
 * ```js
 * const geometry = new THREE.BoxGeometry( 1, 1, 1 );
 * const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
 * const cube = new THREE.Mesh( geometry, material );
 * scene.add( cube );
 * ```
 *
 * @augments BufferGeometry
 */
class BoxGeometry extends BufferGeometry {

	/**
	 * Constructs a new box geometry.
	 *
	 * @param {number} [width=1] - The width. That is, the length of the edges parallel to the X axis.
	 * @param {number} [height=1] - The height. That is, the length of the edges parallel to the Y axis.
	 * @param {number} [depth=1] - The depth. That is, the length of the edges parallel to the Z axis.
	 * @param {number} [widthSegments=1] - Number of segmented rectangular faces along the width of the sides.
	 * @param {number} [heightSegments=1] - Number of segmented rectangular faces along the height of the sides.
	 * @param {number} [depthSegments=1] - Number of segmented rectangular faces along the depth of the sides.
	 */
	constructor( width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1 ) {

		super();

		this.type = 'BoxGeometry';

		/**
		 * Holds the constructor parameters that have been
		 * used to generate the geometry. Any modification
		 * after instantiation does not change the geometry.
		 *
		 * @type {Object}
		 */
		this.parameters = {
			width: width,
			height: height,
			depth: depth,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			depthSegments: depthSegments
		};

		const scope = this;

		// segments

		widthSegments = Math.floor( widthSegments );
		heightSegments = Math.floor( heightSegments );
		depthSegments = Math.floor( depthSegments );

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// helper variables

		let numberOfVertices = 0;
		let groupStart = 0;

		// build each side of the box geometry

		buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height, width, depthSegments, heightSegments, 0 ); // px
		buildPlane( 'z', 'y', 'x', 1, - 1, depth, height, - width, depthSegments, heightSegments, 1 ); // nx
		buildPlane( 'x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 ); // py
		buildPlane( 'x', 'z', 'y', 1, - 1, width, depth, - height, widthSegments, depthSegments, 3 ); // ny
		buildPlane( 'x', 'y', 'z', 1, - 1, width, height, depth, widthSegments, heightSegments, 4 ); // pz
		buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5 ); // nz

		// build geometry

		this.setIndex( indices );
		this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
		this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

		function buildPlane( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

			const segmentWidth = width / gridX;
			const segmentHeight = height / gridY;

			const widthHalf = width / 2;
			const heightHalf = height / 2;
			const depthHalf = depth / 2;

			const gridX1 = gridX + 1;
			const gridY1 = gridY + 1;

			let vertexCounter = 0;
			let groupCount = 0;

			const vector = new Vector3();

			// generate vertices, normals and uvs

			for ( let iy = 0; iy < gridY1; iy ++ ) {

				const y = iy * segmentHeight - heightHalf;

				for ( let ix = 0; ix < gridX1; ix ++ ) {

					const x = ix * segmentWidth - widthHalf;

					// set values to correct vector component

					vector[ u ] = x * udir;
					vector[ v ] = y * vdir;
					vector[ w ] = depthHalf;

					// now apply vector to vertex buffer

					vertices.push( vector.x, vector.y, vector.z );

					// set values to correct vector component

					vector[ u ] = 0;
					vector[ v ] = 0;
					vector[ w ] = depth > 0 ? 1 : - 1;

					// now apply vector to normal buffer

					normals.push( vector.x, vector.y, vector.z );

					// uvs

					uvs.push( ix / gridX );
					uvs.push( 1 - ( iy / gridY ) );

					// counters

					vertexCounter += 1;

				}

			}

			// indices

			// 1. you need three indices to draw a single face
			// 2. a single segment consists of two faces
			// 3. so we need to generate six (2*3) indices per segment

			for ( let iy = 0; iy < gridY; iy ++ ) {

				for ( let ix = 0; ix < gridX; ix ++ ) {

					const a = numberOfVertices + ix + gridX1 * iy;
					const b = numberOfVertices + ix + gridX1 * ( iy + 1 );
					const c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
					const d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

					// faces

					indices.push( a, b, d );
					indices.push( b, c, d );

					// increase counter

					groupCount += 6;

				}

			}

			// add a group to the geometry. this will ensure multi material support

			scope.addGroup( groupStart, groupCount, materialIndex );

			// calculate new start value for groups

			groupStart += groupCount;

			// update total number of vertices

			numberOfVertices += vertexCounter;

		}

	}

	copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}

	/**
	 * Factory method for creating an instance of this class from the given
	 * JSON object.
	 *
	 * @param {Object} data - A JSON object representing the serialized geometry.
	 * @return {BoxGeometry} A new instance.
	 */
	static fromJSON( data ) {

		return new BoxGeometry( data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments );

	}

}

export { BoxGeometry };