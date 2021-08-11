import React, { Component } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import ChainImage from "../Images/chainT.png";

import Link from "react-router-dom/Link";

const styles = theme => ({
  paper: {
    [theme.breakpoints.up("sm")]: {
      borderRadius: "5%",
      marginRight: 30
    },
    [theme.breakpoints.up(1150)]: {
      marginLeft: 50,
      width: 500
    },
    height: "50vh",
    marginTop: theme.spacing.unit * 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  media: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  imgstyles: {
    maxWidth: "70vw",
    maxHeight: "90vh",
    [theme.breakpoints.down(1200)]: {
      marginTop: theme.spacing.unit * 4
    }
  }
});

class AddInstitutes extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container style={{ height: "100%", justifyContent: "center"}}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h5">
                Add Institute Details
              </Typography>
              <form className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Institute Account Address</InputLabel>
                  <Input
                    name="insitute_account_address"
                    id="institute_account_address"
                    autoFocus
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Institute Name</InputLabel>
                  <Input
                    name="institute_name"
                    id="institute_name"
                    autoFocus
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Institute Name</InputLabel>
                  <Input
                    name="institute_name"
                    id="institute_name"
                    autoFocus
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Institute Name</InputLabel>
                  <Input
                    name="institute_name"
                    id="institute_name"
                    autoFocus
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Link</InputLabel>
                  <Input
                    name="link"
                    id="link"
                    autoFocus
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  component={Link} to="/sysadmin-page/add-courses"
                  className={classes.submit}>
                  Next
                </Button>
              </form>
            </Paper>
          </Grid>
      </div>
    );
  }
}

AddInstitutes.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddInstitutes);
