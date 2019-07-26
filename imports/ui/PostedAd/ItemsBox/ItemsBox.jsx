import React from 'react';
// import DeleteOne from '../DeleteOne';
import ViewOneItem from '../ViewOneItem';
import { connect } from 'react-redux';
import useStyles from '../../style/itemTableStyle';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {assignItemsToStoreItemArray} from "../../../actions";

class ItemsBox extends React.Component { 
    componentDidMount() {
        Meteor.call('getItems', function (err, result) {
            if(err){
                console.log("error");
            }
             console.log(result);
             this.props.dataToStore(result);
        }.bind(this));
    }
	render() {
        const classes = useStyles;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Category</TableCell>
                            <TableCell align="right">Description</TableCell>
                            <TableCell align="right">Added Date</TableCell>
                            <TableCell align="right">Operation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.itemArray.map( (item, idx) => {
                        return (
                            <TableRow key={idx}>
                                <TableCell component="th" scope="row">
                                    {item.title}
                                </TableCell>
                                <TableCell align="right">{item.price}</TableCell>
                                <TableCell align="right">{item.category}</TableCell>
                                <TableCell align="left">{item.description}</TableCell>
                                <TableCell align="right">{item.date.toString()}</TableCell>
                                <TableCell align="right"><ViewOneItem index = {idx}/></TableCell>
                            </TableRow>
                        )
                        })
                    }
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dataToStore: (result) => {
            dispatch(assignItemsToStoreItemArray(result));
        }
    }
};

const mapStateToProps = (state) => {
    return { itemArray: state.itemBoxReducer.itemArray};
}
export default connect(mapStateToProps,mapDispatchToProps)(ItemsBox);