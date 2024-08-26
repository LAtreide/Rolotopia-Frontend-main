import ReactDOM from 'react-dom';
import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import UploadService from "../../services/upload-files.service";

export default class Crop extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      crop: {
        unit: '%',
        width: 30,
        aspect: this.props.ancho / this.props.alto,
      },
      clave: 0,
      grayscale: 0,
      brightness: 100,
      contrast: 100,
      sepia: 0,
      croppedImageUrl: null,
      imageUrl: '',
      activo: false,
      completo: false,
      transformaciones: false,
    };
  }

  async componentDidMount() {
    await this.setState({ clave: Math.random() });
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    }
    this.resetImageTransformations();
  };

  handleImageUrlChange = e => {
    this.setState({ imageUrl: e.target.value });
  };

  loadFromUrl = () => {
    this.setState({ src: 'https://corsproxy.io/?' + this.state.imageUrl });

    this.resetImageTransformations();
  };

  resetImageTransformations = () => {
    this.setState({
      grayscale: 0,
      brightness: 100,
      contrast: 100,
      sepia: 0,
      croppedImageUrl: '',
    });
  };

  onImageLoaded = image => {
    this.setState({ imageUrl: "" })
    this.imageRef = image;
    if (this.imageRef) {
      this.imageRef.crossOrigin = 'Anonymous';
    }
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    this.canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    this.canvas.width = crop.width;
    this.canvas.height = crop.height;
    const ctx = this.canvas.getContext('2d');

    ctx.filter = `brightness(${this.state.brightness}%) contrast(${this.state.contrast}%) grayscale(${this.state.grayscale}%) sepia(${this.state.sepia}%)`;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      this.canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/png');
    });
  }

  handleGrayscaleChange = e => {
    this.setState({ grayscale: e.target.value }, () => {
      if (this.imageRef && this.state.src) {
        const crop = this.state.crop;
        this.makeClientCrop(crop);
      }
    });
  };

  handleBrightnessChange = e => {
    this.setState({ brightness: e.target.value }, () => {
      if (this.imageRef && this.state.src) {
        const crop = this.state.crop;
        this.makeClientCrop(crop);
      }
    });
  };

  handleContrastChange = e => {
    this.setState({ contrast: e.target.value }, () => {
      if (this.imageRef && this.state.src) {
        const crop = this.state.crop;
        this.makeClientCrop(crop);
      }
    });
  };

  handleSepiaChange = e => {
    this.setState({ sepia: e.target.value }, () => {
      if (this.imageRef && this.state.src) {
        const crop = this.state.crop;
        this.makeClientCrop(crop);
      }
    });
  };

  handleClick() {
    const reader = new FileReader();
    this.canvas.toBlob(blob => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        this.dataURLtoFile(reader.result, 'file.png');
      };
    });
  }

  async dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let croppedImage = new File([u8arr], filename, { type: mime });
    this.props.subida(await UploadService.upload(croppedImage, this.props.destino, this.props.id));
    this.setState({ src: null, croppedImageUrl: null });
  }

  render() {
    const { crop, src, grayscale, brightness, contrast, sepia, croppedImageUrl, imageUrl } = this.state;

    return (
      <div>
        <div style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}>
          <label style={{ cursor: "pointer" }} onClick={() => { this.setState({ activo: !this.state.activo }) }}>{this.props.texto}</label>
        </div>

        {this.state.activo &&
          <div style={{ marginTop: "15px" }}>

            <div style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}>
              <input type="file" accept="image/*" id={"file" + this.state.clave} onChange={this.onSelectFile} style={{ display: "none" }} />
              <label htmlFor={"file" + this.state.clave} style={{ cursor: "pointer" }}>{"Seleccionar archivo"}</label>
            </div>

            <div>
              <span>Introducir URL de la imagen:  </span>
              <input type="text" id="imageUrl" name="imageUrl" autoComplete="off" value={imageUrl} onChange={this.handleImageUrlChange} />
              <button onClick={this.loadFromUrl}>Cargar</button>
            </div>
          </div>
        }

      {croppedImageUrl && (
          <div>

            <label>
              <input type="checkbox" checked={this.state.completo} onChange={() => this.setState({ completo: !this.state.completo })} />
              Mostrar a tamaño completo
            </label>
            </div>)}

        {src && (
          <ReactCrop
            className={this.state.completo ? 'completoCanva' : ""}
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}

          />
        )}


        {croppedImageUrl && (
          <div>

            <label>  <input type="checkbox" checked={this.state.transformaciones} onChange={() => this.setState({ transformaciones: !this.state.transformaciones })} />
              Transformaciones:
            </label>
            
            {this.state.transformaciones === true && <div>
              <div>
                <label htmlFor="grayscale">Blanco y Negro:</label>
                <input type="range" id="grayscale" name="grayscale" min="0" max="100" value={grayscale} onChange={this.handleGrayscaleChange} />
              </div>
              <div>
                <label htmlFor="sepia">Sepia:</label>
                <input type="range" id="sepia" name="sepia" min="0" max="100" value={sepia} onChange={this.handleSepiaChange} />
              </div>
              <div>
                <label htmlFor="brightness">Brillo:</label>
                <input type="range" id="brightness" name="brightness" min="0" max="200" value={brightness} onChange={this.handleBrightnessChange} />
              </div>
              <div>
                <label htmlFor="contrast">Contraste:</label>
                <input type="range" id="contrast" name="contrast" min="0" max="200" value={contrast} onChange={this.handleContrastChange} />
              </div>
            </div>}
            <img alt="Crop" style={{ width: this.props.ancho }} src={croppedImageUrl} />
          </div>
        )}

        {this.canvas && src ? <button onClick={() => this.handleClick()}>Subir imagen</button> : null}
      </div>
    );
  }
}

ReactDOM.render(<Crop />, document.getElementById('root'));