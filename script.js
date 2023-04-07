import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const BORDER_X_MIN = -30
const BORDER_X_MAX = 30
const BORDER_Y_MIN = 0
const BORDER_Y_MAX = 30
const BORDER_Z_MIN = -30
const BORDER_Z_MAX = 30

class Main {
  defaultMaterial = new THREE.MeshStandardMaterial({color: '#fff'})

  constructor(canvas) {
    this.canvas = canvas

    this.initThreeJS()
    this.initForm()
    this.initGeometriesList()
  }

  initThreeJS() {
    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#a9a9aa')

    // Light
    this.ambientLight = new THREE.AmbientLight('#fff', .5)
    this.Directionallight = new THREE.DirectionalLight('#fff', 10);
    this.Directionallight.position.set(-10, 10, 0)
    this.scene.add(this.Directionallight, this.ambientLight)

    // Camera
    this.camera = new THREE.PerspectiveCamera()
    this.camera.fov = 75
    this.camera.aspect = this.canvas.width / this.canvas.height
    this.camera.near = 1
    this.camera.far = 500
    this.camera.position.set(0, 10, -30)
    this.camera.lookAt(0, 0, 0)
    this.camera.updateProjectionMatrix()
    this.scene.add(this.camera)

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas})
    this.renderer.setSize(this.canvas.width, this.canvas.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setAnimationLoop((t) => {
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    })

    // Helpers
    const gridHelper = new THREE.GridHelper(60, 10)
    this.scene.add(gridHelper)
  }

  initForm() {
    const form = document.getElementById('form')
    const selectGeometryElement = document.getElementById('geometry')
    const scaleInputElement = document.getElementById('scale')
    const submitButton = document.getElementById('create')

    const clearInvalidFields = () => {
      const invalidFields = form.querySelectorAll('.invalid')

      if (!invalidFields.length) {return}

      invalidFields.forEach((field) => {
        field.classList.remove('invalid')
      })
    }

    submitButton.addEventListener('click', () => {
      clearInvalidFields();

      const geometry = selectGeometryElement.options[selectGeometryElement.selectedIndex].value
      const scale = scaleInputElement.value
      
      if (geometry === 'Geometry') {
        selectGeometryElement.classList.add('invalid')
        return
      }

      if (!scale) {
        scaleInputElement.classList.add('invalid')
        return
      }

      this.addGeometry(geometry, scale)
    })
  }

  initGeometriesList() {
    this.geometriesList = document.querySelector('.meshes-wrapper')

    this.geometriesList.addEventListener('click', (e) => {
      if (!e.target.classList.contains('close')) {return}
      this.deleteMesh(e.target.dataset.uuid)
      e.target.parentElement.remove()
    })
  }

  addGeometry(geometry, scale) {
    let threeGeometry;

    switch (geometry) {
      case 'box':
        threeGeometry = new THREE.BoxGeometry()
        break
      case 'capsule':
        threeGeometry = new THREE.CapsuleGeometry()
        break
      case 'circle':
        threeGeometry = new THREE.CircleGeometry()
        break
      case 'cone':
        threeGeometry = new THREE.ConeGeometry()
        break
      case 'cylinder':
        threeGeometry = new THREE.CylinderGeometry()
        break
      case 'dodecahedron':
        threeGeometry = new THREE.DodecahedronGeometry()
        break
      case 'icosahedron':
        threeGeometry = new THREE.IcosahedronGeometry()
        break
      case 'lathe':
        threeGeometry = new THREE.LatheGeometry()
        break
      case 'octahedron':
        threeGeometry = new THREE.OctahedronGeometry()
        break
      case 'ring':
        threeGeometry = new THREE.RingGeometry()
        break
      case 'sphere':
        threeGeometry = new THREE.SphereGeometry()
        break
      case 'tetrahedron':
        threeGeometry = new THREE.TetrahedronGeometry()
        break
      case 'torus':
        threeGeometry = new THREE.TorusGeometry()
        break
      case 'torus-knot':
        threeGeometry = new THREE.TorusKnotGeometry()
        break
    }

    const mesh = new THREE.Mesh(threeGeometry, this.defaultMaterial)
    mesh.position.x = THREE.MathUtils.randFloat(BORDER_X_MIN, BORDER_X_MAX)
    mesh.position.y = THREE.MathUtils.randFloat(BORDER_Y_MIN, BORDER_Y_MAX)
    mesh.position.z = THREE.MathUtils.randFloat(BORDER_Z_MIN, BORDER_Z_MAX)
    mesh.scale.set(scale, scale, scale)

    this.scene.add(mesh)

    this.addToList(mesh.uuid)
  }

  addToList(meshUUID) {
    const li = document.createElement('li')
    li.innerHTML = `${meshUUID}<button type="button" data-uuid="${meshUUID}" class="close"></button>`
    this.geometriesList.prepend(li)
  }

  deleteMesh(uuid) {
    const mesh = this.scene.getObjectByProperty('uuid', uuid)
    mesh.removeFromParent()
  }
}

const canvas = document.getElementById('webgl')

new Main(canvas)
