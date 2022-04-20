import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
      selectedTab: this.props.selectedTab,
    };
  }

  handleChange = (e) => {
    console.log("FLAG: ", e)
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave, selectedTab } = this.props;
    let form = ''
    if (selectedTab === 'device') {
      form = 
      <Form>
        <FormGroup>
          <Input
            type="text"
            id="device_name"
            name="device_name"
            value={this.state.activeItem.name}
            onChange={this.handleChange}
            placeholder="Name"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            id="device_experiment"
            name="device_experiment"
            value={this.state.activeItem.experiment}
            onChange={this.handleChange}
            placeholder="Experiment"
          />
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              name="device_online"
              checked={this.state.activeItem.is_online}
              onChange={this.handleChange}
            />
            ON
          </Label>
        </FormGroup>
      </Form>
    
    }

    return (

      <Modal isOpen={true} toggle={toggle} className="modal">
        <ModalBody className="modal_body">
          <ModalHeader toggle={toggle} className="modal_header">Edit {selectedTab}</ModalHeader >
          {form}
          <ModalFooter className="modal_footer">
            <Button
              color="success"
              onClick={() => onSave(this.state.activeItem)}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    );
  }
}