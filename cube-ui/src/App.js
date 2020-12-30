import axios from 'axios';
import React from 'react';
import threeObj from './threeObj';
import cn from 'classnames';

const url = '/api';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentParams: {
        boxLength: 0,
        boxWidth: 0,
        boxHeight: 0,
      },
      usersParams: {
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
      },
      isDisabled: true,
      showParams: false,
    };
  }

  onChangeLength = (e) => {
    const { usersParams } = this.state;
    const { value } = e.target;
    if (/^[\d]+$/.test(value) || value === '') {
      this.setState({
        usersParams: {
          ...usersParams,
          boxLength: +value || '',
        },
        isDisabled: !(
          value
          && usersParams.boxWidth
          && usersParams.boxHeight
        ),
      });
    }
  };

  onChangeWidth = (e) => {
    const { usersParams } = this.state;
    const { value } = e.target;
    if (/^[\d]+$/.test(value) || value === '') {
      this.setState({
        usersParams: {
          ...usersParams,
          boxWidth: +value || '',
        },
        isDisabled: !(
          value
          && usersParams.boxLength
          && usersParams.boxHeight
        ),
      });
    }
  };

  onChangeHeight = (e) => {
    const { usersParams } = this.state;
    const { value } = e.target;
    if (/^[\d]+$/.test(value) || value === '') {
      this.setState({
        usersParams: {
          ...usersParams,
          boxHeight: +value || '',
        },
        isDisabled: !(
          value
          && usersParams.boxLength
          && usersParams.boxWidth
        ),
      });
    }
  };

  handleSetParams = async (e) => {
    e.preventDefault();
    const { usersParams } = this.state;
    const newParams = await axios.post(url, usersParams, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    threeObj(newParams.data);
    const { boxLength, boxWidth, boxHeight } = newParams.data;
    this.setState({ 
      currentParams: {
        boxLength,
        boxWidth,
        boxHeight,
      },
      usersParams: {
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
      },
      isDisabled: true,
    });
  };

  handleReset = async (e) => {
    e.preventDefault();
    const defParams = await axios.get(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        set: 'defaultParams',
      },
    });
    threeObj(defParams.data);
    const { boxLength, boxWidth, boxHeight } = defParams.data;
    this.setState({ 
      currentParams: {
        boxLength,
        boxWidth,
        boxHeight,
      },
      usersParams: {
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
      },
      isDisabled: true,
    });
  };

  async componentDidMount() {
    const newParams = await axios.get(url, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    threeObj(newParams.data);
    const { boxLength, boxWidth, boxHeight } = newParams.data;
    this.setState({ currentParams: { boxLength, boxWidth, boxHeight } });
  }

  toggleParamsVisibility = () => {
    const { showParams } = this.state;
    this.setState({ showParams: !showParams });
  };

  render() {
    const { currentParams, usersParams, isDisabled, showParams } = this.state;
    return (
      <div className="App">
        <div className="content">
          <canvas id="c"></canvas>
        </div>
        <div className="aside">
          <h1>Cube 3D</h1>
          <form
            onSubmit={this.handleSetParams}
            onReset={this.handleReset}
            className={cn({
              'hidden-low992': !showParams,
              'shown': showParams,
            })}
          >
            <legend>Parameters</legend>
            <div className="form-group">
              <label htmlFor="length">length</label>
              <input
                type="text"
                className="form-control"
                id="length"
                onChange={this.onChangeLength}
                value={usersParams.boxLength}
                placeholder={'current = ' + currentParams.boxLength}
              />
            </div>
            <div className="form-group">
              <label htmlFor="width">width</label>
              <input
                type="text"
                className="form-control"
                id="width"
                onChange={this.onChangeWidth}
                value={usersParams.boxWidth}
                placeholder={'current = ' + currentParams.boxWidth}
              />
            </div>
            <div className="form-group">
              <label htmlFor="height">height</label>
              <input
                type="text"
                className="form-control"
                id="height"
                onChange={this.onChangeHeight}
                value={usersParams.boxHeight}
                placeholder={'current = ' + currentParams.boxHeight}
              />
            </div>
            <button
              type="submit"
              disabled={isDisabled}
              className="btn btn-primary"
            >
              Set Params
            </button>
            <button
              type="reset"
              className="btn btn-warning"
            >
              Just show me a Cube!
            </button>
          </form>
          <button
            className="btn btn-primary btn-show-params"
            onClick={this.toggleParamsVisibility}
          >
            {showParams ? 'Hide parameters' : 'Show parameters'}
          </button>
        </div>
      </div>
    );
  }
}