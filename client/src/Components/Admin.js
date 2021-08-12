import React from "react";
import Institution from '../contracts/Institution.json'
import Web3 from 'web3'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import { Form, } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";



import { List, ListItem, ListItemIcon, ListItemText, withStyles } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AppsIcon from '@material-ui/icons/Apps';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { InputAdornment } from "@material-ui/core";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
// import withStyles from "@material-ui/core/styles/withStyles";
import ChainImage from "../Images/chainT.png";
import Link from "react-router-dom/Link";
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const ListText = withStyles({
  primary: {
    fontSize: '1.5vh',
    padding: '0.5vh',
    margin: 0,
    width: '90%',
  },
})(ListItemText);

// const FrameIcon = withStyles({
//   root: {
//       color: '#9aa4af',
//       height: '3vh',
//       width: '3vh',
//       marginLeft:'0.5vh'
//   }
// })(AppsIcon);

const AddIcon = withStyles({
  root: {
    color: '#9aa4af',
    height: '3vh',
    width: '3vh',
    marginLeft: '0.5vh'
  }
})(AddBoxIcon);




const styles = theme => ({
  container: {
    display: "flex"
  },
  paper: {
    [theme.breakpoints.up("sm")]: {
      borderRadius: "5%",
      marginRight: 30
    },
    [theme.breakpoints.up(1150)]: {
      marginLeft: 50,
      width: 500
    },
    height: "90vh",
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

class Admin extends React.Component {



  state = {
    owner: '0x0',
    isOwner: false,
    institution: {},
    renderLoading: true,
    renderAdmin: false,
    renderMetaMaskError: false,
    instituteAddress: "",
    instituteName: "",
    instituteAcronym: "",
    instituteWebsite: "",
    course: "",
    instituteCourses: new Map(),
    openDialog: false,
    instituteSubmitted: false
  };

  async componentWillMount() {
    await this.loadWeb3Metamask()
    await this.loadBlockChainDataAndCheckAdmin()
  }

  async loadWeb3Metamask() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      this.setState({
        renderLoading: false,
        renderMetaMaskError: true
      })
    }
  }

  // Load contract
  async loadBlockChainDataAndCheckAdmin() {
    const web3 = window.web3
    try {
      const accounts = await web3.eth.getAccounts()
      let caller = accounts[0]
      console.log("caller", caller)
      const networkId = await web3.eth.net.getId()
      console.log("networkId", networkId)
      // Load institution contract
      const institutionData = Institution.networks[networkId]
      if (institutionData) {
        // create a web3 version of the contract
        const institution = new web3.eth.Contract(Institution.abi, institutionData.address)
        console.log("institution", institution)
        this.setState({ institution })
        try {
          // get owner of smart contract
          let smartContractOwner = await institution.methods.owner().call()
          console.log("smartContractOwner", smartContractOwner)
          // compare the caller and the owner of smart contract
          if (caller == smartContractOwner) {
            // give access to the page
            this.setState({
              renderLoading: false,
              renderMetaMaskError: false,
              renderAdmin: true
            })
          }
          else {
            this.setState({
              renderLoading: false,
              renderMetaMaskError: false,
              renderAdmin: false
            })
            window.alert('You are not the admin')
          }
        }
        catch (error) {
          console.log("error is", error)
        }
      }
      else {
        window.alert('Institution contract not deployed to network')
        this.setState({
          renderLoading: false,
          renderMetaMaskError: true,
          renderAdmin: false
        })
      }
    }
    catch {
      // window.alert('No accounts detected')
      console.log("no accounts detected")
    }
  }

  confirmPage() {
    console.log("instAdd", this.state.instituteAddress)
    console.log("name", this.state.instituteName)
    console.log("acro", this.state.instituteAcronym)
    console.log("web", this.state.instituteWebsite)
    console.log("course", this.state.instituteCourses)
  }

  debugFiller() {
    this.setState({
      instituteAddress: "0x33aB3a73F632fb3f12769Adc878cB25ad2916e20",
      instituteName: "National Uni Singapore",
      instituteAcronym: "NUS",
      instituteWebsite: "nus.com",
      instituteCourses: new Map([[1, "ASD"], [2, "EPD"]])

    })
  }

  clearValues() {
    console.log("clearing values")
  }

  async addInstituteToBlockchain() {
    console.log("adding institute to the blockchain")
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    let caller = accounts[0]
    // instantiate the contract (---can't maintain it in a state for some reason, need to check again later----)
    const networkId = await web3.eth.net.getId()
    const institutionData = Institution.networks[networkId]
    const institution = new web3.eth.Contract(Institution.abi, institutionData.address)
    const convertToBlockChainStruct = []

    this.state.instituteCourses.forEach((value, key) => {
      convertToBlockChainStruct.push({ 'course_name': value })
    })

    const provider = window.ethereum;
    provider.on('receipt', this.clearValues)

    try {
      // get owner of smart contract
      let smartContractOwner = await institution.methods.owner().call()

      // compare the caller and the owner of smart contract
      if (caller == smartContractOwner) {
        await institution.methods.addInstitute(
          this.state.instituteAddress,
          this.state.instituteName,
          this.state.instituteAcronym,
          this.state.instituteWebsite,
          convertToBlockChainStruct
        )
          .send({ from: caller }).on('receipt', function (receipt) {
            console.log(receipt);
            console.log(receipt.events)
          })
          .then((res) => {
            this.clearValues()
            this.setState({
              openDialog: false,
              instituteAddress: "",
              instituteName: "",
              instituteAcronym: "",
              instituteWebsite: "",
              instituteCourses: new Map(),
              course: ""
            })
          })
      }
      else {
        window.alert('Not the account used to deploy smart contract')
      }
    }
    catch (error) {
      console.log(error)
      console.log(error.code)
      if (error.code == -32603) {
        window.alert('Institute account already exits')
      }
      else if (error.code == 4001) {
        window.alert('Transaction rejected')
      }
      else {
        window.alert('Institute account address is not legit')
      }

    }
  }


  check() {
    console.log(this.state.instituteCourses)
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  addToCourseMap() {
    if (this.state.instituteCourses.size === 0) {
      let id = 1
      this.setState({
        instituteCourses: new Map(this.state.instituteCourses.set(id, this.state.course)),
        course: ""
      })
    }
    else {
      let instituteCoursesKeys = [...this.state.instituteCourses.keys()]
      let id = Math.max(...instituteCoursesKeys) + 1
      this.setState({
        instituteCourses: new Map(this.state.instituteCourses.set(id, this.state.course)),
        course: ""
      })
    }
  }

  deleteCourse(keyToDelete) {
    console.log("delete getting called")
    const courses = new Map([...this.state.instituteCourses].filter(([k, v]) => k != keyToDelete))
    this.setState({
      instituteCourses: courses
    })
  }

  openDialog() {
    this.setState({
      openDialog: true
    })
  }

  closeDialog() {
    this.setState({
      openDialog: false
    })
  }

  dialogCourses() {
    let listOfCourses = []
    console.log(this.state.instituteCourses)
    this.state.instituteCourses.forEach((value, key) => {
      listOfCourses.push(value)
    })
    console.log(listOfCourses)
    return listOfCourses
  }





  render() {
    const { classes } = this.props;
    const {
      renderLoading,
      renderAdmin,
      renderMetaMaskError,
      course,
      instituteWebsite,
      instituteAddress,
      instituteAcronym,
      instituteName,
      instituteCourses,
      openDialog
    } = this.state;
    return (
      <>
        {
          renderLoading ? (<h1>Loading</h1>) :
            renderMetaMaskError ? (<h1>Metamask issue</h1>) :
              renderAdmin ? (<h1 align="center">Welcome, System Admin</h1>) :
                (<h1>Not admin</h1>)

        }
        {renderAdmin ?
          <>
            <div>
              <Grid container style={{ height: "100%", justifyContent: "center" }}>
                <Paper className={classes.paper}>
                  <Typography component="h1" variant="h5">
                    Add Institute Details
                  </Typography>
                  <form className={classes.form}>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Account Address</InputLabel>
                      <Input
                        id="address"
                        label="Institute Account Address"
                        type="name"
                        value={instituteAddress}
                        onChange={this.handleChange("instituteAddress")}
                        autoFocus
                      />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Institute Name</InputLabel>
                      <Input
                        id="address"
                        label="Institute Name"
                        type="name"
                        value={instituteName}
                        onChange={this.handleChange("instituteName")}
                        autoFocus
                      />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Institute Acronym</InputLabel>
                      <Input
                        id="address"
                        label="Institute Acronym"
                        type="name"
                        value={instituteAcronym}
                        onChange={this.handleChange("instituteAcronym")}
                        autoFocus
                      />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Institute Website</InputLabel>
                      <Input
                        id="address"
                        label="Institute Website"
                        type="name"
                        value={instituteWebsite}
                        onChange={this.handleChange("instituteWebsite")}
                        autoFocus
                      />
                    </FormControl>
                    <div className={classes.container}>
                      <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Course Name</InputLabel>
                        <Input
                          id="address"
                          label="Add course"
                          type="name"
                          value={course}
                          onChange={this.handleChange("course")}
                          autoFocus
                        />
                      </FormControl>
                      <AddIcon button="true" onClick={(e) => this.addToCourseMap()} />
                    </div>
                    {/* <Button onClick={() => this.addToCourseMap()}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}>
                      Add Courses
                    </Button> */}
                    <Button onClick={() => this.debugFiller()}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}>
                      Autofill
                    </Button>
                    <Button onClick={() => this.openDialog()}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}>
                      Confirm
                    </Button>
                    {/* <Button onClick={() => this.openDialog()} variant="contained" color="primary" style={{ backgroundColor: '#00FF66', color: "black", width: '25%', fontSize: '2vh' }} >Add Institute</Button> */}
                    <Dialog open={openDialog} onClose={() => this.closeDialog()} aria-labelledby="form-dialog-title">
                      <DialogTitle id="form-dialog-title">Institution Details</DialogTitle>
                      <DialogContent>
                        Account Address:
                      </DialogContent>
                      <DialogContent>
                        {this.state.instituteAddress}
                      </DialogContent>
                      <DialogContent>
                        Institute Name:
                      </DialogContent>
                      <DialogContent>
                        {this.state.instituteName}
                      </DialogContent>
                      <DialogContent>
                        Institute Acronym:
                      </DialogContent>
                      <DialogContent>
                        {this.state.instituteAcronym}
                      </DialogContent>
                      <DialogContent>
                        Institute Website:
                      </DialogContent>
                      <DialogContent>
                        {this.state.instituteWebsite}
                      </DialogContent>
                      <DialogContent>
                        Institute Courses:
                      </DialogContent>
                      {[...instituteCourses.keys()].map((instituteCourseKey) => {
                        return (
                          <DialogContent>
                            {instituteCourses.get(instituteCourseKey)}
                          </DialogContent>
                        )
                      })}
                      <DialogActions>
                        <Button onClick={() => this.closeDialog()} color="primary">
                          Close
                        </Button>
                        <Button onClick={() => this.addInstituteToBlockchain()} color="primary">
                          Save
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {/*
                    <Button onClick={() => this.addInstituteToBlockchain()}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}>
                      Add Institute
                    </Button> */}
                  </form>
                  <List
                    aria-labelledby="nested-list-subheader"
                  >
                    {[...instituteCourses.keys()].map((instituteCourseKey) => {
                      return (
                        <ListItem id={instituteCourseKey} key={instituteCourseKey.toString()} >
                          {/* <ListItemIcon>
                                        <FrameIcon style={{ color: '#c4c4c4' }} />
                                    </ListItemIcon> */}
                          <ListText primary={instituteCourses.get(instituteCourseKey)} />
                          <DeleteIcon id={instituteCourseKey} button="true" onClick={(e) => this.deleteCourse(e.currentTarget.id)} />
                        </ListItem>
                      )
                    })}
                  </List>
                </Paper>
              </Grid>
              {/* <h1>hello</h1> */}
            </div>
          </> : <></>}


      </>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Admin);