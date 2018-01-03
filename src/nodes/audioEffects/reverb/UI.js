import React from 'react'
import { cx } from 'emotion'

import PropTypes from '~/PropTypes'
import { noop } from '~/util/function'
import { cssLabeled } from '~/util/style'
import Knob from '~/components/Knob'
import TitleBar from '~/components/TitleBar'

const classes = cssLabeled('reverb', {
  root: {
    width: '100%',
    opacity: 1,
    transition: 'opacity 0.2s ease-out',
  },

  inactive: {
    opacity: 0.4,
  },

  controls: {
    width: '100%',
    display: 'flex',
  },

  knobContainer: {
    flex: '0 0 3em',
  },
})

const Reverb = ({
  label,
  wetDryRatio,
  onWetDryRatioChange,
  isActive,
  onLabelChange,
  remove,
  connections,
}) => (
  <div className={cx([classes.root, !isActive && classes.inactive])}>
    <TitleBar
      type="Reverb"
      label={label}
      connections={connections}
      onLabelChange={onLabelChange}
      onRemoveClick={remove}
    />
    <div className={classes.controls}>
      <div className={classes.knobContainer}>
        <Knob
          radius="2.4em"
          value={wetDryRatio}
          onChange={onWetDryRatioChange}
          renderLabel={() => 'W / D'}
          renderTitle={() => 'Wet / Dry ratio'}
          renderValue={() => `${(wetDryRatio * 100).toFixed(1)}%`}
        />
      </div>
    </div>
  </div>
)

Reverb.propTypes = {
  label: PropTypes.string,
  wetDryRatio: PropTypes.number,
  isActive: PropTypes.bool,
  connections: PropTypes.arrayOf(PropTypes.connection),
  onWetDryRatioChange: PropTypes.func,
  onLabelChange: PropTypes.func,
  remove: PropTypes.func,
}

Reverb.defaultProps = {
  label: 'Reverb',
  wetDryRatio: 0.5,
  isActive: true,
  connections: [],
  onWetDryRatioChange: noop,
  onLabelChange: noop,
  remove: noop,
}

export default Reverb
