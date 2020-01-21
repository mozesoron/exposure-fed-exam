import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.duplicateImage = this.duplicateImage.bind(this);
    this.showImage = this.showImage.bind(this);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      isOpen: false,
      dto: null,
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  //duplicate the image
  duplicateImage(dto){
    this.setState(({images}) =>({images: [dto, ...images]}));
  }

//display this image in a larger view.
showImage(dto){
 this.setState(({isOpen}) => ({isOpen: !isOpen, dto}));
}

//get the image
urlFromDto(dto) {
 return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
}


  render() {
    const {isOpen, dto} = this.state;
    return (
      <div>
      <div className="gallery-root">
        {this.state.images.map((dto ,index) => {
          return <Image key={'image-' + index} dto={dto} galleryWidth={this.state.galleryWidth} duplicateImage={this.duplicateImage} showImage={this.showImage} />;
        })}
      </div>
      {isOpen && (
        <dialog
          className="dialog"
          style={{ position: "absolute" }}
          open
        >
          <img
            className="image"
            src={`${this.urlFromDto(dto)}`}
            onClick={this.showImage}
            alt="no image"
          />
        </dialog>
      )}
      </div>
    );
  }
}

export default Gallery;
