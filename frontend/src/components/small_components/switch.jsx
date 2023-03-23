import Form from 'react-bootstrap/Form';

function Switch({label, setChange, init}) {
    return (
        <Form>
        <Form.Check 
            type="switch"
            defaultChecked={init}
            onChange={(ev) => 
                setChange(ev.target.checked)
            }
            label={label}
        />
        </Form>
    );
}

export default Switch;