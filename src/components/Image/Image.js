import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    duplicateImage: PropTypes.func,
    showImage: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    //bind the flipImage method.
    this.flipImage = this.flipImage.bind(this);
    this.addToFavorite = this.addToFavorite.bind(this);
    this.state = {
      size: 200,
      flipped: false,
      isFavorite: false,
      favoriteName:'thumbs-down'
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  //flip the image horizontally (like a mirror).
  flipImage (){
    this.setState(({flipped}) => ({flipped: !flipped}));
  }

  //add and remove favorite images for user
  addToFavorite(){
    const {dto: {id}} = this.props;
    let favorites = localStorage.getItem('favorites') || "";
    const arrfavoritesStorage = favorites.split(','); 
    const includeFavorite = arrfavoritesStorage.includes(id);
    if (includeFavorite){
      //remove image from favorite
      let filtered = arrfavoritesStorage.filter(function(value, index, arr){
        return value != id;
      });
      localStorage.setItem('favorites', filtered.toString()); 
      this.setState(({favoriteName}) => ({favoriteName: 'thumbs-up'}));
    }else{
      //add imge to favorire
      favorites = `${favorites},${id}`
      localStorage.setItem('favorites', favorites);
      this.setState(({favoriteName}) => ({favoriteName: 'thumbs-down'}));
    }  
  }

  render() {
    const {flipped} = this.state;
    //add css to image for flip when flipped is true.
    const clsRoot = classNames('image-root', {'image-flip': flipped});
    //get dto from Gallery;
    const {dto} = this.props;

    return (
      <div
        className={clsRoot}
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        <div>
          <FontAwesome className="image-icon" onClick={this.flipImage} name="arrows-alt-h" title="flip"/>
          <FontAwesome className="image-icon" onClick={this.props.duplicateImage.bind(this, dto)} name="clone" title="clone"/>
          <FontAwesome className="image-icon" onClick={this.props.showImage.bind(this, dto)} name="expand" title="expand"/>
          <FontAwesome className="image-icon" onClick={this.addToFavorite} name={this.state.favoriteName} title="Add to favorite" />
          {/* share image to Facebook */}
          <a href={`https://facebook.com/sharer/sharer.php?u=${this.urlFromDto(this.props.dto)}`}>
             <FontAwesomeIcon className="image-icon"  icon={faFacebook} title="facebook"/>
          </a>
        </div>
      </div>
    );
  }
}

export default Image;
