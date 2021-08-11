import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SubmitAnimation from "./SubmitAnimation";
import { generateCertificate } from "../Utils/apiConnect";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 520,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    [theme.breakpoints.up("sm")]: { width: 250 },
    [theme.breakpoints.down("sm")]: { width: 200 }
  },
  instituteField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    [theme.breakpoints.up("sm")]: { width: 520 },
    [theme.breakpoints.down("sm")]: { width: 200 }
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  paper: {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing.unit,
      padding: `${theme.spacing.unit * 2}px`
    },
    minHeight: "75vh",
    maxWidth: "95%",
    margin: theme.spacing.unit * 5,
    display: "flex",
    flexDirection: "column",
    padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 8}px ${theme
      .spacing.unit * 3}px`
  },
  rightpaper: {
    [theme.breakpoints.up("sm")]: {
      maxHeight: "75vh"
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "95%",
      margin: theme.spacing.unit * 2
    },
    maxWidth: "60%",
    minWidth: "60%",
    margin: theme.spacing.unit * 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  verificationBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyItems: "center",
    height: "100%",
    marginTop: theme.spacing.unit * 3
  },
  courseField: {
    [theme.breakpoints.up("sm")]: {
      width: "60%"
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: "80vw"
    }
  },
  submitBtn: {
    marginLeft: "50px"
  }
});

class GenerateForm extends React.Component {
  state = {
    firstname: "",
    lastname: "",
    organization: "FossAsia",
    orgLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/FOSSASIA_Logo.svg/600px-FOSSASIA_Logo.svg.png",
    coursename: "",
    assignedOn: null,
    duration: 0,
    currentState: "normal",
    emailId: ""
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  submitData = event => {
    event.preventDefault();
    if (this.state.currentState === "validate") {
      return;
    }
    this.setState({ currentState: "load" });
    const {
      firstname,
      lastname,
      organization,
      coursename,
      assignedOn,
      duration,
      emailId
    } = this.state;
    let candidateName = `${firstname} ${lastname}`;
    let assignDate = new Date(assignedOn).getTime();
    generateCertificate(
      candidateName,
      coursename,
      organization,
      assignDate,
      parseInt(duration),
      emailId
    )
      .then(data => {
        console.log(data)
        if (data.data !== undefined)
          this.setState({
            currentState: "validate",
            certificateId: data.data.certificateId
          });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { classes } = this.props;
    const {
      firstname,
      lastname,
      organization,
      coursename,
      duration,
      currentState,
      orgLogo,
      emailId,
      certificateId
    } = this.state;
    return (
      <Grid container align = "center" justify = "center" alignItems = "center">
        <Grid item xs={8} sm={8}>
          <Paper className={classes.paper}>
            <Typography variant="h3" color="inherit">
              Certificate Generation Form
            </Typography>
            <form
              className={classes.container}
              autoComplete="off"
              onSubmit={this.submitData}
            >
            <Grid item xs={12} sm={12}>
            <TextField
              required
              id="institute-name"
              label="Institute Name"
              className={classes.instituteField}
              defaultValue={instituteName}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              required
              id="institute-acronym"
              label="Institute Acronym"
              className={classes.instituteField}
              defaultValue={instituteAcronym}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              required
              id="institute-website"
              label="Institute Website"
              className={classes.instituteField}
              defaultValue={instituteWebsite}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
            </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="firstname"
                  label="First Name"
                  className={classes.textField}
                  value={firstname}
                  onChange={this.handleChange("firstname")}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  id="lastname"
                  label="Last Name"
                  className={classes.textField}
                  value={lastname}
                  onChange={this.handleChange("lastname")}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={12} >
                <FormControl required variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="course-name">Course Name</InputLabel>
                  <Select
                    native
                    value={this.state.course}
                    onChange={this.handleChange("coursename")}
                    label="Age"
                    inputProps={{
                      course:'',
                      id:'course-name'
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option value={10}>Course 1</option>
                    <option value={20}>Course 2</option>
                    <option value={30}>Course 3</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <SubmitAnimation
                  currentState={currentState}
                  className={classes.submitBtn}
                />
                {currentState === "validate" && (
                  <Typography
                    variant="caption"
                    color="inherit"
                    className={classes.submitBtn}
                  >
                    Certificate genrated with id {certificateId}
                  </Typography>
                )}
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

    );
  }
}

GenerateForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GenerateForm);