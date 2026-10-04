import logo from './logo.svg';
import './App.css';
import Head from './component/layout/Head';
import Foot from './component/layout/Foot';
import MenuLeft from './component/layout/MenuLeft';

function App(props) {
  return (
    <div className="App">
    <Head/>
    <section>
      <div className='container'>
        <div className='row'>
          <MenuLeft/>  
            {props.children}
        </div>
      </div>
    </section>
    <Foot/>
    </div>
  );
}

export default App;
