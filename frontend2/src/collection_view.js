import {React} from './config.js';

import {SimpleTsumego} from './tsumego_view.js';


export default function Gallery() {

return (
    <section>
    <h1>Amazing scientists</h1>

    <SimpleTsumego id={3} />
    <SimpleTsumego id={3} display_coords={true}/>
    <SimpleTsumego id={3} />

    </section>
);
}