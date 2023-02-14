import { AppContext } from "context/AppContext";
import { API } from "lib/api";
import React, { useContext, useState } from "react";
import { Button, Modal, Form, Image } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Toast from "lib/sweetAlerts";

export default function ImageModal(props) {
    const [state, dispatch] = useContext(AppContext);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    image: "",
  });

  const {image} = form;

  let { data: modalsUser } = useQuery("modalschangeimagecache", async () => {
    const response = await API.get("/user/" + state.user.id)
    return response.data.data
  }) 

  const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
		});
		if (e.target.type === "file") {
			let url = URL.createObjectURL(e.target.files[0]);
			setPreview(url);
		}
	};
  

  const changeImage = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.append("image", form.image[0], form.image[0].name)

      const response = await API.patch("/user/changeImage/" + state.user.id, formData)

      if (response != null) {
        Toast.fire({
					icon: "success",
					title: "Successfully Change Photo Profile",
				});
        props.onHide();
      }

      props.onHide();
    } catch (error) {
      console.log(error)
      Toast.fire({
        icon: "error",
        title: "Failed to Change Photo Profile!!!",
      });
    }
  })
  return (
    <Modal {...props} size="md" centered>
      <Modal.Body className="m-3">
        <h1 className="text-center mt-3 mb-5 fw-bold">Change Profile Picture</h1>
        <Form onSubmit={(e) => changeImage.mutate(e)}>
          {preview && (
            <div>
              <Image src={preview} style={{width: "435px", height: "400px", objectFit: "cover", marginBottom: 10}} alt={"ini alt"} rounded/>
            </div>
          )}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="image" className="fw-bold fs-4">Upload New Picture</Form.Label>
            <Form.Control type="file" id="image" name="image" onChange={handleChange} size='lg'/>
          </Form.Group>
          <Form.Group className="ms-autp mb-4">
            <Button size="lg" type="submit" className="mt-4 py-3 px-4 w-100">Change Profile Picture</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  )
}