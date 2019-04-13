import React, { Component } from "react";
import { Button } from "reactstrap";
import { Redirect } from "react-router-dom";
import cookies from "universal-cookie";
import axios from "../config/axios";
import { connect } from "react-redux";
import { onEdit, logout } from "../actions/index";

const cookie = new cookies();

class Profile extends Component {
  state = {
    edit: true
  };

  uploadFile = async () => {
    const formData = new FormData();
    var imagefile = this.gambar;

    formData.append("avatar", imagefile.files[0]);
    try {
      await axios.post(`/users/${cookie.get("idLogin")}/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (e) {
      console.log("upload gagal");
    }
  };

  deleteFile = async userId => {
    try {
      axios.patch(`/avatar/${userId}`, {
        avatar: null
      });
    } catch (e) {
      console.log(e);
    }
  };

  profile = () => {
    const { name, age, id } = this.props.user;
    if (this.state.edit) {
      return (
        <div>
          <li class="list-group-item pl-0">{`Name: ${name}`}</li>
          <li class="list-group-item pl-0">{`Age: ${age}`}</li>
          <li class="list-group-item px-0">
            <div class="d-flex justify-content-between">
              <Button
                onClick={() => {
                  this.setState({ edit: !this.state.edit });
                }}
                color="outline-warning"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  this.deleteProfile(this.props.user.id);
                }}
                color="outline-danger"
              >
                Delete
              </Button>
            </div>
          </li>
        </div>
      );
    }
    return (
      <div>
        <li class="list-group-item pl-0">
          <input
            type="text"
            class="form-control"
            ref={input => {
              this.name = input;
            }}
            defaultValue={name}
          />
        </li>
        <li class="list-group-item pl-0">
          <input
            type="number"
            class="form-control"
            ref={input => {
              this.age = input;
            }}
            defaultValue={age}
          />
        </li>
        <li class="list-group-item px-0">
          <div class="d-flex justify-content-center">
            <Button
              onClick={() => {
                this.saveProfile(id);
              }}
              color="outline-primary"
            >
              save
            </Button>
          </div>
        </li>
      </div>
    );
  };

  deleteProfile = async userId => {
    try {
      await axios.delete(`/users/${userId}/delete`);
      this.props.logout();
    } catch (e) {
      console.log(e);
    }
  };

  saveProfile = async userId => {
    const name = this.name.value;
    const age = this.age.value;
    this.props.onEdit(name, age, userId);
    this.setState({ edit: !this.state.edit });
  };

  render() {
    if (cookie.get("idLogin")) {
      return (
        <div className="container">
          <div class="card w-25">
            <img
              src={`http://localhost:2009/users/${cookie.get(
                "idLogin"
              )}/avatar`}
              class="card-img-top"
              alt="..."
            />

            <div class="card-body">
              <div className="custom-file">
                <input
                  type="file"
                  id="myfile"
                  ref={input => (this.gambar = input)}
                />
              </div>
              <div class="d-flex justify-content-between">
                <Button color="primary" onClick={() => this.uploadFile()}>
                  Upload
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    this.deleteFile(this.props.user.id);
                  }}
                >
                  Delete
                </Button>
              </div>

              <ul class="list-group list-group-flush mt-3">{this.profile()}</ul>
            </div>
          </div>
        </div>
      );
    }

    return <Redirect to="login" />;
  }
}

const mapStateToProps = state => {
  return { user: state.auth };
};

export default connect(
  mapStateToProps,
  { onEdit, logout }
)(Profile);
