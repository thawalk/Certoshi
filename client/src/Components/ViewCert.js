import React, { useState } from "react";

// External Components
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Fade,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import OpenInNewOutlinedIcon from "@material-ui/icons/OpenInNewOutlined";
// import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "30px",
    minHeight: "91.5vh",
    lineHeight: "1.5",
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
}));

function ViewCert() {
  const [certId, setCertId] = useState("");
  const classes = useStyles();
  return (
    <>
      <Typography
        variant="h4"
        color="primary"
        align="center"
        style={{ marginTop: "30px" }}
      >
        Welcome, Employers
      </Typography>
      <Typography
        variant="subtitle2"
        color="secondary"
        align="center"
        style={{ marginTop: "30px" }}
      >
        You may key in the certificate id to view the Verified Certificate
        created on the Credentials Ethereum Blockchain
      </Typography>
      <Grid
        container
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: " center",
        }}
        direction="column"
        align
      >
        <Paper className={classes.paper} style={{ borderRadius: "10px" }}>
          <Card
            style={{
              border: "1px solid #363b98",
              minWidth: "250px",
              minHeight: "70px",
            }}
          >
            <CardContent style={{ textAlign: "center" }}>
              <Typography variant="h5" color="primary">
                View Certificate
              </Typography>
            </CardContent>
          </Card>
          <Box m={4} />
          <TextField
            id="outlined-basic"
            label="Certificate ID"
            variant="outlined"
            onChange={(e) => {
              setCertId(e.target.value);
            }}
            style={{ width: "400px" }}
          />
          <Box m={2} />
          {certId && (
            <>
              <Fade in={certId ? true : false} timeout={700}>
                <Box display="flex">
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    //   endIcon={<FileCopyOutlinedIcon />}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.href.slice(
                          0,
                          -window.location.pathname.length
                        )}/certificate/${certId}`
                      );
                    }}
                    style={{ marginRight: "10px" }}
                  >
                    Copy link
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    endIcon={<OpenInNewOutlinedIcon />}
                    onClick={() => {
                      window.open(
                        `${window.location.href.slice(
                          0,
                          -window.location.pathname.length
                        )}/certificate/${certId}`
                      );
                    }}
                  >
                    Open link
                  </Button>
                </Box>
              </Fade>
            </>
          )}
        </Paper>
        <Box>
          <Typography variant="subtitle1" style={{ fontWeight: "900" }}>
            {" "}
            For demo purposes only, here are some live certificates you can try
            to view:
          </Typography>
          <Typography style={{ textAlign: "center" }}>
            f45615d8-75d2-4ca9-a210-1511cd14129f
          </Typography>
          <Typography style={{ textAlign: "center" }}>
            5a61d8ed-15bd-4e34-953e-44029f4bbbd6
          </Typography>
        </Box>
      </Grid>
    </>
  );
}

export default ViewCert;
