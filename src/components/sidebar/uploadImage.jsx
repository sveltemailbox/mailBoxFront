import { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // API Endpoints
  custom_file_upload_url = `YOUR_API_ENDPOINT_SHOULD_GOES_HERE`;

  // Image Preview Handler
  const handleImagePreview = (e) => {
    let imageAsBbase64 = URL.createObjectURL(e.target.files[0])
    let imageAsFiles = e.target.files[0];

    setFile(imageAsBbase64);
    setImagePreview(imageAsFiles);
  }

  // Image/File Submit Handler
  const handleSubmitFile = () => {
    if (file !== null){
      let formData = new FormData();
      formData.append('file', file);
      // the image field name should be similar to your api endpoint field name
      // in my case here the field name is customFile

      axios.post(
        this.custom_file_upload_url,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('auth')}`,
            "Content-type": "multipart/form-data",
          },                    
        }
      )
      .then(res => {
          console.log(`Success` + res.data);
      })
      .catch(err => {
          console.log(err);
      })
    }
  }

  return (
      <div>
        {/* image preview */}
        <img src={imagePreview} alt="image preview"/>

        {/* image input field */}
        <input
            type="file"
            onChange={handleImagePreview}
        />
        <label>Upload file</label>
        <input type="submit" onClick={handleSubmitFile} value="Submit"/>
    </div>
  );
}

export default FileUpload;