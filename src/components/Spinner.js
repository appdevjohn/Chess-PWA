import './Spinner.css';

const Spinner = props => (
    <div className={props.hidden ? 'container hidden' : 'container'}>
        <svg viewBox="0 0 24 24" class="pie">
            <circle class="chart" r="10.5" cx="50%" cy="50%"></circle>
        </svg>
    </div>
)

export default Spinner;