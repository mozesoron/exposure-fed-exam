import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames'; 

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
    this.state = {
      size: 200
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
        </div>
      </div>
    );
  }
}

export default Image;
