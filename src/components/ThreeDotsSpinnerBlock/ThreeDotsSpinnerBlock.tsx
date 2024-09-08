import spinnerBlockCls from './ThreeDotsSpinnerBlock.module.scss';
import threeDotsSpinnerSvgSrc from './images/threeDotsSpinner.svg?url';

interface Props {
  blockClassName?: string,
  spinnerClassName?: string,
}

const ThreeDotsSpinnerBlock: React.FC<Props> = ({ blockClassName, spinnerClassName }) => (
  <div className={blockClassName || spinnerBlockCls.spinnerBlock}>
    <img
      className={spinnerClassName || spinnerBlockCls.spinner}
      src={threeDotsSpinnerSvgSrc}
      alt="Loading spinner ..."
    />
  </div>
);

export default ThreeDotsSpinnerBlock;
