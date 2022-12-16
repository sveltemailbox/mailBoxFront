import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import {updateMostFrequent} from "../../redux/action/InboxAction"
import { useHistory } from 'react-router-dom';
function Switch(props) {
    const history = useHistory()
    const [isToggled,setIsToggled] = useState(false)
    const handleChange = (e) => {
        const {checked} = e?.target
            setIsToggled(checked)
    }

   const handleClick = () => {
        props?.updateMostFrequent(Number(isToggled))
        history.push("/mail")
    }
  return (
  
    <div style={{display:"flex",padding:"5px",maxWidth:"600px",justifyContent:"space-between",alignItems:"center"}}> 
    <Form>
      <Form.Check 
        type="switch"
        id="custom-switch"
        label="Most Frequent"
        onChange={(e) => handleChange(e)}
        checked={isToggled}
        style={{color:"gray",fontSize:"16px",fontWeight:"bold"}}
      />
    </Form>
    <button onClick={handleClick} type="button" style={{ height: 30 }} disabled={!isToggled}  className="btn btn-lg btn-primary">Apply</button>
    </div>
  );
}


const mapActionToProps = {
    updateMostFrequent:updateMostFrequent
};
const mapStateToProps = (state) => ({
    isMostFrequent:state.isMostFrequent
});

export default connect(mapStateToProps,mapActionToProps)(Switch);