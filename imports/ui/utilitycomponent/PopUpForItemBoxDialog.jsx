import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { closePopedItemInItemBox} from '../../actions';
import MapContainer from './unModifiableMap';

import {likeItem} from '../../actions';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import SvgIcon from '@material-ui/core/SvgIcon';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


class CustomizedDialogs extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClose() {
        console.log('close it ');
        console.log(this.props.itemForPopUp);   
        this.props.closePopeditem();
    };

    handleClick(){
      console.log(this.props.liked);
      console.log(this.props);
      console.log(this.props.itemForPopUp);
      this.props.likeItem(Meteor.userId(), this.props.itemForPopUp._id);
      console.log(this.props.itemForPopUp);

      if (!this.props.itemForPopUp.like.includes(Meteor.userId())) {
      let newLike = [...this.props.itemForPopUp.like];
      //console.log(newLike);
      //console.log(newLike.length);
      newLike.splice(newLike.length, 0, Meteor.userId());
      // console.log(newLike);
      let revisedPopUpItem=  Object.assign({},this.props.itemForPopUp, 
          {
          like: newLike,
      }
      );
 
      Meteor.call('updateOneItem', this.props.itemForPopUp._id, revisedPopUpItem);
    
      console.log(this.props.itemForPopUp.user_id);
      console.log(this.props.itemForPopUp._id);
      console.log(this.props);
      console.log(this.props.likeItem);

      console.log('liked status is:' + this.props.liked);
      alert('Liked one item!');
     
      // this.props.close();
      } else {
      //alert('Already Liked!');
      }
    }

    render() {
        return (
        <div>
            <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.props.shouldOpen}
            >
            <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            {this.props.itemForPopUp.title}
            </DialogTitle>
            <DialogContent dividers>
                {this.props.itemForPopUp.imagePreviewUrl!==undefined ?
                    <img src={this.props.itemForPopUp.imagePreviewUrl} width={"150"} height={"150"}/>:
                    null
                }
                <Typography gutterBottom>
                    <b>Price:</b>                $ {this.props.itemForPopUp.price}
                </Typography>
                <Typography gutterBottom>
                    <b>Category: </b>                {this.props.itemForPopUp.category}
                </Typography>
                <Typography gutterBottom>
                    <b>Posted on: </b>                {this.props.itemForPopUp.date.toString()}
                </Typography>
                <Typography gutterBottom>
                    {(this.props.itemForPopUp.locationStr===""|| this.props.itemForPopUp.locationStr===undefined)?
                        <div> <b>Location: </b>   Not Provided</div>:
                        <div>
                        <b>Location: </b>                {this.props.itemForPopUp.locationStr}
                        </div>}


                </Typography>
                <Typography gutterBottom>
                    <b>Contact Info: </b>
                    {this.props.itemForPopUp.owner.owner_email}
                </Typography>
                <Typography gutterBottom>
                    <b>User Name: </b>
                    {this.props.itemForPopUp.owner.username}
                </Typography>
                <div><br/></div>
                <Typography gutterBottom>
                    <b>Description: </b>                {this.props.itemForPopUp.description}
                </Typography>

                {(this.props.itemForPopUp.location["lat"]===999 &&this.props.itemForPopUp.location["lng"]===-999)?
                    <div><b>Map is not available for this posting</b></div>:
                    <MapContainer mapContainerSize = {{
                        height: "300px",
                        width: "500px",
                    }}
                                  fatherLetShow = {true}
                                  markerLocation = {this.props.itemForPopUp.location}/>
                }

            </DialogContent>
            <DialogActions>


      <FormControlLabel
        control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={this.props.itemForPopUp.like.includes(Meteor.userId())} onClick={this.handleClick}/>}
        label=""/>

            </DialogActions>
            </Dialog>
        </div>
        );
    }
    }

const mapStateToProps = (state) => {
    return {
      itemForPopUp: state.itemBoxReducer.popUpItemInItemBox,
      shouldOpen: state.itemBoxReducer.shouldPopUpInitemBox,
      liked: state.itemBoxReducer.liked
      // shouldUpdateItem: state.updateItem, // updated to update item 
        // toPopThisIndex : state.itemProcess.popUpitemIndex,
        // item: state.itemProcess.itemArray[state.itemProcess.popUpitemIndex],
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
      closePopeditem: () => {
        dispatch(closePopedItemInItemBox());
      }, 
      likeItem: (userId, postId) => {
        dispatch(likeItem(userId, postId));
      }
};
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomizedDialogs)
