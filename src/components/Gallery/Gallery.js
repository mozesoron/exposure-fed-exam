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
    this.loadMore = this.loadMore.bind(this);
    this.checkEndOfPage = this.checkEndOfPage.bind(this);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      isOpen: false,
      dto: null,
      page: 1,
    };
    //refs are used to get reference to a DOM
    this.listRef = null;
    this.setListRef = element => {
      this.listRef = element;
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
    const {page} = this.state;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${page}&format=json&safe_search=1&nojsoncallback=1`;    const baseUrl = 'https://api.flickr.com/';
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
          this.setState(({images}) => ({images: [...images,...res.photos.photo]}));
        }
      });
  }

  //Is being performed after the render
  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('scroll', this.checkEndOfPage);
  }

  //remove the evevt
  componentWillUnmount(){
    window.removeEventListener('scroll', this.checkEndOfPage);
  }
  
  //Is being performed after props changed
  //nextProps -  new props that function accept
  componentWillReceiveProps(nextProps) {
    if(this.props.tag !== nextProps.tag){
        this.setState({images: []});
        this.getImages(nextProps.tag);
      }
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

  loadMore(){
    this.setState(({page}) => ({page: page+1}));
    this.getImages(this.props.tag);
  }

  checkEndOfPage(){
    const list = this.listRef;
    if (window.scrollY + window.innerHeight === list.clientHeight + list.offsetTop) {
      this.loadMore();
    }
  }

  render() {
    const {isOpen, dto} = this.state;
    const {favorites} = this.props;
    const favoritesStorage = localStorage.getItem('favorites') || "";
    const arrfavoritesStorage = favoritesStorage.split(',');
    const images = favorites ? this.state.images.filter(({id}) => arrfavoritesStorage.includes(id)) : this.state.images;
    return (
      <div ref={this.setListRef}>
      <div className="gallery-root">
        {images.map((dto ,index) => {
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
