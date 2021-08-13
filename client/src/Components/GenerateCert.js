import React from "react";
import Institution from "../contracts/Institution.json";
import Certification from "../contracts/Certification.json";
import Web3 from "web3";
import { v4 as uuidv4 } from "uuid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SubmitAnimation from "./SubmitAnimation";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import FormHelperText from "@material-ui/core/FormHelperText";
import CryptoJS from "crypto-js";
import { encrypt } from "./encrypt";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Button from "@material-ui/core/Button";
import OpenInNewOutlinedIcon from "@material-ui/icons/OpenInNewOutlined";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { Box, IconButton, CircularProgress } from "@material-ui/core";
import { Error } from "./Error";
import { Loader } from "./Loader";
import LoopOutlinedIcon from "@material-ui/icons/LoopOutlined";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    height: "3px",
    justifyContent: "center",
    backgroundColor: "#b09ce8",
  },
})((props) => <Tabs {...props} />);

const StyledTab = withStyles((theme) => ({
  root: {
    color: "white", //'#9aa4af',
    opacity: 0.5,
    fontSize: "20px",
    padding: "10px",
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab {...props} />);

const styles = (theme) => ({
  appbar: {
    background: "linear-gradient(109.96deg,#363e98,#8ac6ff),#fff",
  },
  tabPanel: {
    height: "100%",
    overflowY: "scroll",
    marginBottom: "2vh",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
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
    [theme.breakpoints.down("sm")]: { width: 200 },
  },
  instituteField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    [theme.breakpoints.up("sm")]: { width: 520 },
    [theme.breakpoints.down("sm")]: { width: 200 },
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  paper: {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing.unit,
      padding: `${theme.spacing.unit * 2}px`,
    },
    minHeight: "75vh",
    maxWidth: "95%",
    margin: theme.spacing.unit * 5,
    display: "flex",
    flexDirection: "column",
    padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 8}px ${theme
      .spacing.unit * 3}px`,
    marginTop: "20px",
  },
  rightpaper: {
    [theme.breakpoints.up("sm")]: {
      maxHeight: "75vh",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "95%",
      margin: theme.spacing.unit * 2,
    },
    maxWidth: "60%",
    minWidth: "60%",
    margin: theme.spacing.unit * 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  verificationBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyItems: "center",
    height: "100%",
    marginTop: theme.spacing.unit * 3,
  },
  courseField: {
    [theme.breakpoints.up("sm")]: {
      width: "60%",
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: "80vw",
    },
  },
  submitBtn: {
    marginLeft: "50px",
  },
});

class GenerateCert extends React.Component {
  state = {
    owner: "0x0",
    isCorrectInstitute: false,
    renderLoading: true,
    renderMetaMaskError: false,
    networkError: false,
    instituteName: "",
    instituteAcronym: "",
    instituteWebsite: "",
    instituteCourses: [],
    candidateName: "",
    selectedCourse: null,
    isLegitInstitute: null,
    currentState: "normal", // normal/load/validate
    certificateId: "",
    courseIndex: 0,
    creationDate: null,
    txnFailed: false,
    tabValue: 0,
    revokeCertificateId: "",
    revokeCurrentState: "normal",
    revokeTxnFailed: false,
  };

  async componentWillMount() {
    await this.loadWeb3Metamask();
  }

  // async loadWeb3Metamask() {
  //   if (window.ethereum) {
  //     window.web3 = new Web3(window.ethereum);
  //     await window.ethereum.enable().then((res) => {
  //       this.setState({
  //         renderLoading: false,
  //         renderMetaMaskError: false,
  //       });
  //     });
  //   } else if (window.web3) {
  //     window.web3 = new Web3(window.web3.currentProvider);
  //     this.setState({
  //       renderLoading: false,
  //       renderMetaMaskError: false,
  //     });
  //   } else {
  //     //   window.alert(
  //     //     "Non-Ethereum browser detected. You should consider trying MetaMask!"
  //     //   );
  //     toast.warning(
  //       "❕ Non-Ethereum browser detected. You should consider trying MetaMask!"
  //     );
  //     this.setState({
  //       renderLoading: false,
  //       renderMetaMaskError: true,
  //     });
  //   }
  // }

  async loadWeb3Metamask() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      this.setState({
        renderMetaMaskError: false,
      });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      this.setState({
        renderMetaMaskError: false,
      });
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

  async checkAddressAndGetCourses() {
    console.log(1);
    const web3 = window.web3;
    if (web3 === undefined) {
      return;
    }
    console.log(2);

    const accounts = await web3.eth.getAccounts();
    console.log(3);
    let caller = accounts[0];
    console.log(4);

    // TODO: Fix bug
    let networkId;
    try {
      networkId = await web3.eth.net.getId();
    } catch (err) {
      console.log("You are currently on this network:", networkId);
      this.setState({
        renderLoading: false,
        renderMetaMaskError: false,
        networkError: true,
      });
      toast.warning(
        "❕ Please make sure you are connected to the correct network"
      );
      return;
    }

    if (!(networkId in Institution.networks)) {
      console.log("You are currently on this network:", networkId);
      this.setState({ networkError: true, renderLoading: false });
      toast.warning(
        "❕ Please make sure you are connected to the correct network"
      );
      return;
    }

    const institutionData = Institution.networks[networkId];
    console.log(institutionData);
    console.log(Institution);
    const institution = new web3.eth.Contract(
      Institution.abi,
      institutionData.address
    );

    try {
      await institution.methods
        .getInstituteData()
        .call({ from: caller })
        .then((res) => {
          console.log("Here's the institute data retrieved:");
          console.log(res);
          const formattedInstituteCoursesData = res[3].map((x) => {
            return { course_name: x.course_name };
          });

          this.setState({
            instituteName: res[0],
            instituteAcronym: res[1],
            instituteWebsite: res[2],
            instituteCourses: formattedInstituteCoursesData,
            isLegitInstitute: true,
            renderLoading: false,
          });
        });
    } catch (error) {
      // alert("Account address is wrong or does not exist in the smart contract");
      toast.warning("❕ You are not authorized to access this page");
      this.setState({ isLegitInstitute: false, renderLoading: false });
    }
  }

  handleTextFieldChangeCandidateName(e) {
    this.setState({
      candidateName: e.target.value,
    });
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
      currentState: "normal",
      revokeCurrentState: "normal",
    });
  };

  revokeCertificateFunction = async (event) => {
    event.preventDefault();
    if (this.state.revokeCurrentState === "validate") {
      return;
    }
    this.setState({
      revokeCurrentState: "load",
    });
    const web3 = window.web3;
    // if (web3 === undefined) {
    //     return;
    // }
    const accounts = await web3.eth.getAccounts();
    let caller = accounts[0];

    const networkId = await web3.eth.net.getId();
    const certificationData = Certification.networks[networkId];
    const certification = new web3.eth.Contract(
      Certification.abi,
      certificationData.address
    );
    // const certificate_id = "f0f7373a-2b69-4ea7-b78a-371ebe485d7a"
    const { revokeCertificateId } = this.state;
    try {
      await certification.methods
        .revokeCertificate(revokeCertificateId)
        .send({ from: caller, gas: 2100000 })
        .on("receipt", function(receipt) {
          // ----- here can use a state or smth, to display a success message -----
          console.log(receipt);
          console.log(receipt.events);
        })
        .then((res) => {
          console.log("Success in revoking certificate:", revokeCertificateId);
          // alert(`Successfully revoked the certificate ${revokeCertificateId}`);
          toast.success("✅ Successfully revoked certificate!");
          this.setState({
            revokeCurrentState: "validate",
            certificateId: revokeCertificateId,
            revokeTxnFailed: false,
          });
        });
    } catch (error) {
      console.log(error);
      console.log(error.code);
      this.setState({
        revokeCurrentState: "normal",
        revokeTxnFailed: true,
        revokeCertificateId: revokeCertificateId,
      });
      if (error.code == -32603) {
        // -32603:
        // 1) certificate id already exists - won't encounter this
        // 2) transaction failed due to gas problems
        // window.alert(
        //   "Transaction failed. Please check that you have set enough gas limit."
        // );
        toast.error(
          "❌ Revocation Transaction failed. Please check that certificate id exists and you have set enough gas limit."
        );
      }
      if (error.code == 4001) {
        // window.alert("Transaction rejected");
        toast.error("❌ Revocation Transaction rejected!");
      }
    }
  };

  submitData = async (event) => {
    event.preventDefault();
    if (this.state.currentState === "validate") {
      return;
    }
    this.setState({
      currentState: "load",
    });
    // this.setState({ currentState: "load" });
    const { firstname, lastname, courseIndex } = this.state;
    let candidateName = `${firstname} ${lastname}`;
    // let assignDate = new Date(assignedOn).getTime();
    console.log("Submit button clicked, below are current details:");
    const certId = uuidv4();
    const creationDate = new Date().getTime();
    console.log("[0] certId:", certId);
    console.log("[1] candidateName:", candidateName);
    console.log("[2] courseIndex:", courseIndex);
    console.log("[3] creationDate:", creationDate);
    // instantiate the contract (---can't maintain it in a state for some reason, need to check again later----)
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    let caller = accounts[0];
    const networkId = await web3.eth.net.getId();
    const certificationData = Certification.networks[networkId];
    const certification = new web3.eth.Contract(
      Certification.abi,
      certificationData.address
    );
    try {
      await certification.methods
        .generateCertificate(
          certId,
          encrypt(candidateName, certId),
          courseIndex,
          encrypt(creationDate, certId)
        )
        .send({ from: caller, gas: 2100000 })
        .on("receipt", function(receipt) {
          console.log(receipt);
        })
        .then((res) => {
          // console.log("Success in generating certificate:", certId);
          // alert(`Successfully generated a certificate (${certId})!`);
          this.setState({
            currentState: "validate",
            certificateId: certId,
            txnFailed: false,
          });
        });
    } catch (error) {
      console.log(error);
      console.log(error.code);
      this.setState({
        currentState: "normal",
        txnFailed: true,
        certificateId: certId,
      });
      if (error.code == -32603) {
        // -32603:
        // 1) certificate id already exists - won't encounter this
        // 2) transaction failed due to gas problems
        // window.alert(
        //   "Transaction failed. Please check that you have set enough gas limit."
        // );
        toast.error(
          "❌ Transaction failed. Please check that you have set enough gas limit."
        );
      }
      if (error.code == 4001) {
        // window.alert("Transaction rejected");
        toast.error("❌ Transaction rejected!");
      }
      // this.setState({
      //     currentState: "fail",
      //     certificateId: certId,
      // });
    }
  };

  async componentWillMount() {
    await this.loadWeb3Metamask();
    await this.checkAddressAndGetCourses();
  }

  handleTabChange = (event, newValue) => {
    this.setState({
      tabValue: newValue,
    });
  };

  a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  render() {
    const { classes } = this.props;
    const {
      renderLoading,
      renderMetaMaskError,
      networkError,
      instituteName,
      instituteAcronym,
      instituteWebsite,
      instituteCourses,
      isLegitInstitute,
      firstname,
      lastname,
      certificateId,
      currentState,
      txnFailed,
      tabValue,
      revokeCertificateId,
      revokeCurrentState,
      revokeTxnFailed,
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
        ) : (
          <></>
        )}
        {networkError && (
          <Error
            message="You are not connected to the correct network on Ethereum"
            label="Please try again once you have connected to the right network (Rinkeby testnet)"
            buttonText="Done"
          />
        )}

        {isLegitInstitute && (
          <>
            <Grid container align="center" justify="center" alignItems="center">
              <Grid item xs={8} sm={8}>
                <Typography
                  variant="h4"
                  color="primary"
                  align="center"
                  style={{ marginTop: "30px" }}
                >
                  Welcome, Institute
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="secondary"
                  align="center"
                  style={{ marginTop: "30px" }}
                >
                  You may create or revoke a certificate on the Credentials
                  Ethereum Blockchain below
                </Typography>
                <Paper className={classes.paper}>
                  <AppBar position="static" className={classes.appbar}>
                    <StyledTabs
                      value={tabValue}
                      onChange={this.handleTabChange}
                      aria-label="simple tabs example"
                      variant="fullWidth"
                    >
                      <StyledTab
                        label="Generate Certificate"
                        {...this.a11yProps(0)}
                      />
                      <StyledTab
                        label="Revoke Certificate"
                        {...this.a11yProps(1)}
                      />
                    </StyledTabs>
                  </AppBar>
                  <div style={styles.tabPanel}>
                    <TabPanel value={tabValue} index={0}>
                      <form
                        className={classes.container}
                        autoComplete="off"
                        onSubmit={this.submitData}
                        style={{ marginTop: "3vh" }}
                      >
                        <Grid item xs={12} sm={12}>
                          <Typography variant="subtitle1">
                            Input the certificate details below to generate a
                            certificate
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            required
                            disabled
                            id="institute-name"
                            label="Institute Name"
                            className={classes.instituteField}
                            defaultValue={instituteName}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                          <TextField
                            required
                            disabled
                            id="institute-acronym"
                            label="Institute Acronym"
                            className={classes.instituteField}
                            defaultValue={instituteAcronym}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                          <TextField
                            required
                            disabled
                            id="institute-website"
                            label="Institute Website"
                            className={classes.instituteField}
                            defaultValue={instituteWebsite}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                              readOnly: true,
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
                        <Grid item xs={12} sm={12}>
                          <FormControl
                            required
                            variant="outlined"
                            className={classes.formControl}
                          >
                            <InputLabel htmlFor="course-index">
                              Course
                            </InputLabel>
                            <Select
                              native
                              value={this.state.courseIndex}
                              onChange={this.handleChange("courseIndex")}
                              label="Courses"
                            >
                              {instituteCourses &&
                                instituteCourses.map((course, index) => {
                                  return (
                                    <option value={index} key={index}>
                                      {course.course_name}
                                    </option>
                                  );
                                })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} justifyContent>
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <SubmitAnimation
                              currentState={currentState}
                              className={classes.submitBtn}
                            />
                            {currentState === "validate" && (
                              <IconButton
                                style={{ marginTop: "16px" }}
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                  this.setState({
                                    currentState: "normal",
                                    firstname: "",
                                    lastname: "",
                                    courseIndex: 0,
                                  });
                                }}
                              >
                                <LoopOutlinedIcon />
                              </IconButton>
                            )}
                          </Box>

                          {currentState === "validate" && (
                            <>
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Typography
                                  variant="caption"
                                  color="inherit"
                                  className={classes.submitBtn}
                                  style={{ marginRight: "10px" }}
                                >
                                  Certificate generated with id {certificateId}
                                </Typography>

                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      certificateId
                                    );
                                  }}
                                >
                                  <FileCopyOutlinedIcon />
                                </IconButton>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  className={classes.button}
                                  endIcon={<OpenInNewOutlinedIcon />}
                                  onClick={() => {
                                    window.open(
                                      `${window.location.href.slice(
                                        0,
                                        -window.location.pathname.length
                                      )}/certificate/${certificateId}`
                                    );
                                  }}
                                >
                                  Open
                                </Button>
                              </Box>
                            </>
                          )}

                          {txnFailed && (
                            <div>
                              Failed to generate certificate, please try again.
                            </div>
                          )}
                        </Grid>
                      </form>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                      <form
                        className={classes.container}
                        autoComplete="off"
                        onSubmit={this.revokeCertificateFunction}
                        style={{ marginTop: "3vh" }}
                      >
                        <Grid item xs={12} sm={12}>
                          <Typography variant="subtitle1">
                            Input the id of the certificate you want to revoke
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            required
                            id="revoke_certificate_id"
                            label="Certificate ID"
                            className={classes.instituteField}
                            defaultValue={revokeCertificateId}
                            value={revokeCertificateId}
                            margin="normal"
                            variant="outlined"
                            onChange={this.handleChange("revokeCertificateId")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <SubmitAnimation
                              currentState={revokeCurrentState}
                              className={classes.submitBtn}
                            />
                            {revokeCurrentState === "validate" && (
                              <IconButton
                                style={{ marginTop: "16px" }}
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                  this.setState({
                                    revokeCurrentState: "normal",
                                    revokeCertificateId: "",
                                  });
                                }}
                              >
                                <LoopOutlinedIcon />
                              </IconButton>
                            )}
                          </Box>

                          {revokeCurrentState === "validate" && (
                            <>
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Typography
                                  variant="caption"
                                  color="inherit"
                                  className={classes.submitBtn}
                                  style={{ marginRight: "10px" }}
                                >
                                  Revoked Certificate with id{" "}
                                  {revokeCertificateId}
                                </Typography>

                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      revokeCertificateId
                                    );
                                  }}
                                >
                                  <FileCopyOutlinedIcon />
                                </IconButton>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  className={classes.button}
                                  endIcon={<OpenInNewOutlinedIcon />}
                                  onClick={() => {
                                    window.open(
                                      `${window.location.href.slice(
                                        0,
                                        -window.location.pathname.length
                                      )}/certificate/${revokeCertificateId}`
                                    );
                                  }}
                                >
                                  Open
                                </Button>
                              </Box>
                            </>
                          )}

                          {revokeTxnFailed && (
                            <div>
                              Failed to revoke certificate, please try again.
                            </div>
                          )}
                        </Grid>
                      </form>
                    </TabPanel>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
        {isLegitInstitute === false && (
          <Error
            message="You are not connected to a valid institute account"
            label="Please try again once you have connected to the right account"
            buttonText="Done"
          />
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

export default withStyles(styles)(GenerateCert);
