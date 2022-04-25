import {
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Gene Tigner - Resume & Portfolio';

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private rotationSpeedX: number = 0.003;
  private rotationSpeedY: number = 0.0008;
  private size: number = 2;
  private sphereSize: number = 6;
  private sphereTilt: number = 0.235;

  private cameraZ: number = 300;
  private fieldOfView: number = 2;
  private nearClippingPlane: number = 1;
  private farClippingPlane: number = 1000;

  public mouseIsDown: boolean = false;

  private camera!: PerspectiveCamera;

  private texture: string = '/assets/textures/8k_earth_nightmap.jpg';

  private loader: TextureLoader = new TextureLoader();

  private geometrySphere: SphereGeometry = new SphereGeometry(
    this.sphereSize,
    64,
    64
  );

  private geometrySphereShell: SphereGeometry = new SphereGeometry(
    this.sphereSize * 1.12,
    16,
    16
  );

  private geometry: BoxGeometry = new BoxGeometry(
    this.size,
    this.size,
    this.size
  );

  private material: MeshBasicMaterial = new MeshBasicMaterial({
    wireframe: true,
    color: 0x00ff00,
  });

  private sphereMaterial: MeshBasicMaterial = new MeshBasicMaterial({
    map: this.loader.load(this.texture),
  });

  private planeMaterial: MeshBasicMaterial = new MeshBasicMaterial({
    map: this.loader.load(this.texture),
  });

  private sphereMaterialShell: MeshBasicMaterial = new MeshBasicMaterial({
    wireframe: true,
    color: 0x14bdeb,
    transparent: true,
    opacity: 0.5,
  });

  private cube: Mesh = new Mesh(this.geometry, this.material);
  public sphere: Mesh = new Mesh(this.geometrySphere, this.sphereMaterial);
  public sphereShell: Mesh = new Mesh(
    this.geometrySphereShell,
    this.sphereMaterialShell
  );

  private renderer!: WebGLRenderer;
  private scene!: Scene;

  ngOnInit(): void {
    // this.canvasRef.nativeElement.width = window.innerWidth;
    // this.canvasRef.nativeElement.height = window.innerHeight;
  }

  ngAfterViewInit(): void {
    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;
    this.createScene();
    this.startRenderingLoop();

    window.onresize = () => {
      console.log('resize');
      console.log(this.canvasRef.nativeElement.width);
      this.canvasRef.nativeElement.width = window.innerWidth;
      this.canvasRef.nativeElement.height = window.innerHeight;
      console.log(this.canvasRef.nativeElement.width);
      this.resize();
    };
  }

  resize() {
    console.log('resize - inside function');
    //console.log(renderer);
    this.renderer.clear();
    this.renderer.setSize(
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height,
      false
    );
    this.camera.aspect =
      this.canvasRef.nativeElement.width / this.canvasRef.nativeElement.height;
    this.camera.updateProjectionMatrix();
    //renderer?.setSize(window.innerWidth, window.innerHeight);
  }

  startRenderingLoop() {
    //Renderer
    // Use canvas element in template
    this.renderer = new WebGLRenderer({
      canvas: this.canvasRef?.nativeElement,
      antialias: true,
    });

    this.resize();
    this.sphere.rotateX(0.5);
    this.sphereShell.rotateX(0.5);
    this.sphere.rotateOnAxis(new Vector3(0, 0, 1), this.sphereTilt);
    this.sphereShell.rotateOnAxis(new Vector3(0, 0, 1), this.sphereTilt);
    this.render();
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.animateCube();
    this.animateSpheres([this.sphere, this.sphereShell], null);
    this.renderer?.render(this.scene, this.camera);
  }

  createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0xffffff);
    this.scene.add(this.cube);
    this.scene.add(this.sphere);
    this.scene.add(this.sphereShell);

    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.y = 2;
    this.camera.position.x = -8;
    this.camera.position.z = this.cameraZ;
  }

  getAspectRatio() {
    return (
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight
    );
  }

  animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  private mouseStartPosition: number = 0;
  private mouseCurrentPosition: number = 0;

  animateSpheres(
    spheres: Mesh[] = [this.sphere, this.sphereShell],
    $event: MouseEvent | null
  ) {
    //this.sphere.rotation.x += this.rotationSpeedX;

    //if the mouse is dragging, rotate the sphere relative to the mouse position
    if (this.mouseIsDown && $event !== null) {
      //console.log($event);
      $event?.stopPropagation();
      $event?.preventDefault();

      // let mouseX: number | undefined = $event?.clientX;
      // let localMouseX: number = 0;
      // if (mouseX !== undefined) {
      //   localMouseX = mouseX;
      // }

      //start mouse position
      if (this.mouseStartPosition === 0) {
        //console.log('start: ' + $event?.clientX);
        this.mouseStartPosition =
          $event?.clientX === undefined ? 0 : $event?.clientX;
      }

      //current mouse position
      //console.log('current: ' + $event?.clientX);
      this.mouseCurrentPosition =
        $event?.clientX === undefined ? 0 : $event?.clientX;

      //console.log(
      //   `${this.mouseStartPosition} - ${this.mouseCurrentPosition} = ${
      //     this.mouseStartPosition - this.mouseCurrentPosition
      //   }`
      // );
      //rotation speed
      let rotationSpeed: number =
        (this.mouseStartPosition - this.mouseCurrentPosition) / 100000;

      //console.log(rotationSpeed);
      spheres.forEach((object) => {
        object.rotateY(rotationSpeed);
      });
      return;
    }

    //if the mouse is not dragging, reset the mouse position
    this.mouseStartPosition = 0;
    this.mouseCurrentPosition = 0;

    spheres.forEach((object) => {
      object.rotateY(this.rotationSpeedY);
    });
  }
}
