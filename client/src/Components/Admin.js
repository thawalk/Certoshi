import React from "react";
import Institution from "../contracts/Institution.json";
import Web3 from "web3";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Form } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import { Loader } from "./Loader";
import { Error } from "./Error";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  withStyles,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import AppsIcon from "@material-ui/icons/Apps";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

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
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";

const ListText = withStyles({
  primary: {
    fontSize: "1.5vh",
    padding: "0.5vh",
    margin: 0,
    width: "90%",
  },
})(ListItemText);

const styles = (theme) => ({
  container: {
    display: "flex",
  },
  paper: {
    [theme.breakpoints.up("sm")]: {
      borderRadius: "5%",
      marginRight: 30,
    },
    [theme.breakpoints.up(1150)]: {
      marginLeft: 50,
      width: 500,
    },
    height: "100%",
    marginTop: theme.spacing.unit * 6,
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    // marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  media: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  imgstyles: {
    maxWidth: "70vw",
    maxHeight: "90vh",
    [theme.breakpoints.down(1200)]: {
      marginTop: theme.spacing.unit * 4,
    },
  },
  courseItem: {
    width: "100%",
    background: "#73737312",
    borderRadius: "100px",
    marginBottom: "10px",
    paddingLeft: "25px",
    marginBottom: "10px",
    border: "1px solid #d8d8d8",
  },
});

class Admin extends React.Component {
  state = {
    owner: "0x0",
    isOwner: false,
    institution: {},
    renderLoading: true,
    renderAdmin: false,
    renderMetaMaskError: false,
    networkError: false,
    instituteAddress: "",
    instituteName: "",
    instituteAcronym: "",
    instituteWebsite: "",
    course: "",
    instituteCourses: new Map(),
    openDialog: false,
    openCourseDialog: false,
    instituteSubmitted: false,
  };

  async componentWillMount() {
    await this.loadWeb3Metamask();
    await this.loadBlockChainDataAndCheckAdmin();
  }

  async loadWeb3Metamask() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // window.alert(
      //   "Non-Ethereum browser detected. You should consider trying MetaMask!"
      // );
      toast.warning(
        "❕ Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      this.setState({
        renderLoading: false,
        renderMetaMaskError: true,
      });
    }
  }

  // Load contract
  async loadBlockChainDataAndCheckAdmin() {
    const web3 = window.web3;
    // if (web3 === undefined) { // TODO: You can use this
    //   return;
    // }
    try {
      const accounts = await web3.eth.getAccounts();
      let caller = accounts[0];
      console.log("caller", caller);

      const networkId = await web3.eth.net.getId();
      // TODO: You can use this - can remove the try catch blocks
      // if (!(networkId in Institution.networks)) {
      //   console.log("You are currently on this network:", networkId);
      //   this.setState({ networkError: true });
      //   toast.warning(
      //     "❕ Please make sure you are connected to the correct network"
      //   );
      //   return;
      // }

      console.log("networkId", networkId);
      // Load institution contract
      const institutionData = Institution.networks[networkId];
      if (institutionData) {
        // create a web3 version of the contract
        const institution = new web3.eth.Contract(
          Institution.abi,
          institutionData.address
        );
        console.log("institution", institution);
        this.setState({ institution });
        try {
          // get owner of smart contract
          let smartContractOwner = await institution.methods.owner().call();
          console.log("smartContractOwner", smartContractOwner);
          // compare the caller and the owner of smart contract
          if (caller == smartContractOwner) {
            // give access to the page
            this.setState({
              renderLoading: false,
              renderMetaMaskError: false,
              renderAdmin: true,
            });
          } else {
            this.setState({
              renderLoading: false,
              renderMetaMaskError: false,
              renderAdmin: false,
            });
            // window.alert("You are not the admin");
            toast.warning("❕ You are not authorized to access this page");
          }
        } catch (error) {
          console.log("error is", error);
        }
      } else {
        // window.alert("Institution contract not deployed to network");
        toast.warining("❕ Institution contract not deployed to network");
        this.setState({
          renderLoading: false,
          renderMetaMaskError: true,
          renderAdmin: false,
        });
      }
    } catch {
      // window.alert('No accounts detected')
      console.log("no accounts detected");

      // When this block is reached, most likely due to user on wrong network
      console.log("You are on the wrong network!");
      toast.warning(
        "❕ Please make sure you are connected to the correct network"
      );
      this.setState({
        renderLoading: false,
        renderMetaMaskError: false,
        renderAdmin: false,
        networkError: true,
      });
    }
  }

  confirmPage() {
    console.log("instAdd", this.state.instituteAddress);
    console.log("name", this.state.instituteName);
    console.log("acro", this.state.instituteAcronym);
    console.log("web", this.state.instituteWebsite);
    console.log("course", this.state.instituteCourses);
  }

  debugFiller() {
    console.log("Filling up form with pre-created institute");
    this.setState({
      instituteAddress: "",
      instituteName: "Singapore University of Technology and Design",
      instituteAcronym: "SUTD",
      instituteWebsite: "https://www.sutd.edu.sg/",
      instituteCourses: new Map([
        [1, "Computer Science and Design"],
        [2, "Engineering Product Development"],
        [3, "Engineering Systems and Design"],
        [3, "Architecture and Sustainable Design"],
      ]),
    });
  }

  clearValues() {
    console.log("clearing values");
  }

  async addInstituteToBlockchain() {
    console.log("Adding institute to the blockchain");
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    let caller = accounts[0];
    // instantiate the contract (---can't maintain it in a state for some reason, need to check again later----)
    const networkId = await web3.eth.net.getId();
    const institutionData = Institution.networks[networkId];
    const institution = new web3.eth.Contract(
      Institution.abi,
      institutionData.address
    );
    const convertToBlockChainStruct = [];

    this.state.instituteCourses.forEach((value, key) => {
      convertToBlockChainStruct.push({ course_name: value });
    });

    const provider = window.ethereum;
    provider.on("receipt", this.clearValues);

    try {
      // get owner of smart contract
      let smartContractOwner = await institution.methods.owner().call();

      // compare the caller and the owner of smart contract
      if (caller == smartContractOwner) {
        await institution.methods
          .addInstitute(
            this.state.instituteAddress,
            this.state.instituteName,
            this.state.instituteAcronym,
            this.state.instituteWebsite,
            convertToBlockChainStruct
          )
          .send({ from: caller })
          .on("receipt", function(receipt) {
            console.log(receipt);
            console.log(receipt.events);
          })
          .then((res) => {
            this.clearValues();
            this.setState({
              openDialog: false,
              instituteAddress: "",
              instituteName: "",
              instituteAcronym: "",
              instituteWebsite: "",
              instituteCourses: new Map(),
              course: "",
            });
            // alert("Successfully added institute!");
            toast.success("✅ Successfully added institute!");
          });
      } else {
        // window.alert("Not the account used to deploy smart contract");
        toast.warning("❕ Not the account used to deploy smart contract");
      }
    } catch (error) {
      console.log(error);
      console.log(error.code);
      if (error.code == -32603) {
        // window.alert("Institute account already exits");
        toast.error("❌ Institute account already exits!");
      } else if (error.code == 4001) {
        // window.alert("Transaction rejected");
        toast.warning("❕ Transaction rejected!");
      } else {
        // window.alert("Institute account address is not legit");
        // toast.error("❌ Institute account address is not legit!");
        toast.error("❌ Institute account already exits! Please check again!"); // Temporarily added to handle duplicate institute test case on rinkeby, that is not -32603
      }
    }
  }

  check() {
    console.log(this.state.instituteCourses);
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  addToCourseMap() {
    if (!this.state.course) {
      console.log("Empty input for course name, please input something.");
      return;
    }
    this.handleCloseCourse();
    if (this.state.instituteCourses.size === 0) {
      let id = 1;
      this.setState({
        instituteCourses: new Map(
          this.state.instituteCourses.set(id, this.state.course)
        ),
        course: "",
      });
    } else {
      let instituteCoursesKeys = [...this.state.instituteCourses.keys()];
      let id = Math.max(...instituteCoursesKeys) + 1;
      this.setState({
        instituteCourses: new Map(
          this.state.instituteCourses.set(id, this.state.course)
        ),
        course: "",
      });
    }
  }

  deleteCourse(keyToDelete) {
    console.log("delete getting called");
    const courses = new Map(
      [...this.state.instituteCourses].filter(([k, v]) => k != keyToDelete)
    );
    this.setState({
      instituteCourses: courses,
    });
  }

  handleClickOpenCourse = () => {
    this.setState({
      openCourseDialog: true,
    });
  };

  handleCloseCourse = () => {
    this.setState({
      openCourseDialog: false,
    });
  };

  openDialog() {
    this.setState({
      openDialog: true,
    });
  }

  closeDialog() {
    this.setState({
      openDialog: false,
    });
  }

  dialogCourses() {
    let listOfCourses = [];
    console.log(this.state.instituteCourses);
    this.state.instituteCourses.forEach((value, key) => {
      listOfCourses.push(value);
    });
    console.log(listOfCourses);
    return listOfCourses;
  }

  render() {
    const { classes } = this.props;
    const {
      renderLoading,
      renderAdmin,
      renderMetaMaskError,
      networkError,
      course,
      instituteWebsite,
      instituteAddress,
      instituteAcronym,
      instituteName,
      instituteCourses,
      openDialog,
    } = this.state;
    return (
      <>
        {renderLoading ? (
          <Loader text="Connecting..." />
        ) : renderMetaMaskError ? (
          <Error
            message="You are not using an Ethereum-based browser"
            label="You could download Metamask on this browser or use an another ethereum-based browser"
            buttonText="Done"
          />
        ) : renderAdmin ? (
          <>
            <Typography
              variant="h4"
              color="primary"
              align="center"
              style={{ marginTop: "30px" }}
            >
              Welcome, Central Authority
            </Typography>
            <Typography
              variant="subtitle2"
              color="secondary"
              align="center"
              style={{ marginTop: "30px" }}
            >
              You may add an institute into the Credentials Ethereum Blockchain
              below
            </Typography>
          </>
        ) : (
          <>
            {!networkError && (
              <Error
                message="You are not connected to a valid Central Authority account"
                label="Please try again once you have connected to the right account"
                buttonText="Done"
              />
            )}
          </>
        )}
        {networkError && (
          <Error
            message="You are not connected to the correct network on Ethereum"
            label="Please try again once you have connected to the right network (Rinkeby testnet)"
            buttonText="Done"
          />
        )}

        {renderAdmin ? (
          <>
            <div>
              <Grid
                container
                style={{ height: "100%", justifyContent: "center" }}
              >
                <Paper className={classes.paper}>
                  <Card
                    style={{
                      border: "1px solid #363b98",
                      minWidth: "250px",
                      minHeight: "70px",
                    }}
                  >
                    <CardContent style={{ textAlign: "center" }}>
                      <Typography variant="h5" color="primary">
                        Institute Registration
                      </Typography>
                    </CardContent>
                  </Card>

                  <Box m={1} />
                  <Typography
                    variant="h6"
                    style={{ alignSelf: "flex-start", marginBottom: "-10px" }}
                  >
                    Details
                  </Typography>
                  <form
                    className={classes.form}
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">
                        Institute Account Address
                      </InputLabel>
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
                      <InputLabel htmlFor="email">
                        Institute Website Link
                      </InputLabel>
                      <Input
                        id="address"
                        label="Institute Website"
                        type="name"
                        value={instituteWebsite}
                        onChange={this.handleChange("instituteWebsite")}
                        autoFocus
                      />
                    </FormControl>
                    <Box m={3} />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignContent="center"
                    >
                      <Typography
                        variant="h6"
                        style={{
                          alignSelf: "flex-start",
                          marginBottom: "-10px",
                        }}
                      >
                        Courses
                      </Typography>
                      <IconButton
                        color="primary"
                        onClick={this.handleClickOpenCourse}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Box>

                    {[...instituteCourses.keys()].map((instituteCourseKey) => {
                      return (
                        <>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignContent="center"
                            className={classes.courseItem}
                          >
                            <Typography style={{ alignSelf: "center" }}>
                              {instituteCourses.get(instituteCourseKey)}
                            </Typography>
                            <IconButton
                              id={instituteCourseKey}
                              color="primary"
                              onClick={(e) =>
                                this.deleteCourse(e.currentTarget.id)
                              }
                            >
                              <DeleteIcon
                                id={instituteCourseKey}
                                button="true"
                              />
                            </IconButton>
                          </Box>
                        </>
                      );
                    })}
                    {/* ------ Dialog to add course ------*/}
                    <Dialog
                      open={this.state.openCourseDialog}
                      onClose={this.handleCloseCourse}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        Add an Institute Course
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          After adding this course, this course will be one of
                          the choices of courses available for selection in
                          certificate generation.
                        </DialogContentText>
                        {/* <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="email">Course Name</InputLabel>
                          <Input
                            id="address"
                            label="Course name"
                            type="name"
                            value={course}
                            onChange={this.handleChange("course")}
                            autoFocus
                          />
                        </FormControl> */}
                        <Input
                          id="address"
                          label="Course name"
                          type="name"
                          value={course}
                          onChange={this.handleChange("course")}
                          autoFocus
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={this.handleCloseCourse}
                          color="primary"
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={(e) => {
                            this.addToCourseMap();
                          }}
                          color="primary"
                          variant="contained"
                        >
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Button
                      onClick={() => this.debugFiller()}
                      fullWidth
                      variant="outlined"
                      color="primary"
                      className={classes.submit}
                    >
                      Autofill
                    </Button>
                    <Button
                      onClick={() => this.openDialog()}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Add Institute
                    </Button>
                    {/* ------ Dialog to confirm adding Institute ------*/}
                    <Dialog
                      open={openDialog}
                      onClose={() => this.closeDialog()}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        <Typography variant="h5" color="primary">
                          Institute Details
                        </Typography>
                      </DialogTitle>
                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Account Address:
                        </Typography>
                        <Typography variant="subtitle2">
                          {this.state.instituteAddress}
                        </Typography>
                      </DialogContent>

                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Institute Name:
                        </Typography>
                        <Typography variant="subtitle2">
                          {this.state.instituteName}
                        </Typography>
                      </DialogContent>

                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Institute Acronym:
                        </Typography>
                        <Typography variant="subtitle2">
                          {this.state.instituteAcronym}
                        </Typography>
                      </DialogContent>

                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Institute Website:
                        </Typography>
                        <Typography variant="subtitle2">
                          {this.state.instituteWebsite}
                        </Typography>
                      </DialogContent>

                      <DialogContent>
                        <Typography variant="h6" color="secondary">
                          Institute Courses:
                        </Typography>

                        {[...instituteCourses.keys()].map(
                          (instituteCourseKey, index) => {
                            return (
                              <Typography variant="subtitle2" key={index}>
                                {instituteCourses.get(instituteCourseKey)}
                              </Typography>
                            );
                          }
                        )}
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => this.closeDialog()}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => this.addInstituteToBlockchain()}
                          color="primary"
                        >
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </form>
                </Paper>
              </Grid>
            </div>
          </>
        ) : (
          <></>
        )}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Admin);
