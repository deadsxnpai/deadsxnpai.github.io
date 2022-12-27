import './App.css';
import { useState } from 'react';
import axios from 'axios'

function App() {
  const [code, setCode] = useState('#include <iostream>\n#include <cstdlib>\n\nusing namespace std;\n\nint main() {\n      cout << "Hello, world!" << endl;\n      return 0; \n}');
  const [output, setOutput] = useState('');
  const handleSubmit = async () =>{
    const payload = {
      language:"cpp",
      code
    };
    try{ 
    const { data } = await axios.post("http://localhost:5000/run", payload);
    setOutput(data.output);
    } catch(err){
      console.log(err);
      setOutput('У вас ошибка!');
    }
  }

  return (
      <div>
        <h1>C++ code compiler</h1>
          <textarea rows="15" cols="75" value={code} onChange={(e) => {
            setCode(e.target.value);
            }}>
            </textarea> <br/>
          <button onClick={handleSubmit} className="btn-secondary fw-bold border-white bg-white "> Run code </button>
          <hr/>
          <h2>Ouput</h2>
          <textarea readonly rows="10" cols="75" value={output}></textarea>
      </div>
  );
}

export default App;
