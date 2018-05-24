import React, { Component } from 'react';
import { connect } from 'react-redux';
import { switchSettings } from '../../actions/switchSettings';
import DataService from '../../services/firebaseDataService';
import './settings.css';

class Settings extends Component {

  cycle() {
    const db = new DataService();

    let defaultSettings = {
      'longBreak': {
        'defaultValue': 30,
        'step': 5,
        'borders': {
          'max': 30,
          'min': 15
        }
      },
      'shortBreak': {
        'defaultValue': 5,
        'step': 1,
        'borders': {
          'max': 5,
          'min': 3
        }
      },
      'workIter': {
        'defaultValue': 5,
        'step': 1,
        'borders': {
          'max': 5,
          'min': 2
        }
      },
      'workTime': {
        'defaultValue': 25,
        'step': 5,
        'borders': {
          'max': 25,
          'min': 15
        }
      }
    };

    // current cycle settings
    var cycleSettings = {
      parent: document.querySelector('.cycle__cont'),
      workTime: defaultSettings.workTime.defaultValue,
      workIter: defaultSettings.workIter.defaultValue,
      shortBreak: defaultSettings.shortBreak.defaultValue,
      longBreak: defaultSettings.longBreak.defaultValue
    };

    // page initialization
    document.getElementById('work-time').innerHTML = defaultSettings.workTime.defaultValue;
    document.getElementById('work-iteration').innerHTML = defaultSettings.workIter.defaultValue;
    document.getElementById('short-break').innerHTML = defaultSettings.shortBreak.defaultValue;
    document.getElementById('long-break').innerHTML = defaultSettings.longBreak.defaultValue;

    render(cycleSettings);

    var elems = {
      workIter: {
        elem: document.querySelector('.choose-block__option--work-iteration'),
        field: document.getElementById('work-iteration'), setCurrentValue: function (val, settings) {
          settings.workIter = val;
        }
      },
      workTime: {
        elem: document.querySelector('.choose-block__option--work-time'),
        field: document.getElementById('work-time'),
        setCurrentValue: function (val, settings) {
          settings.workTime = val;
        }
      },
      shortBreak: {
        elem: document.querySelector('.choose-block__option--short-break'),
        field: document.getElementById('short-break'),
        setCurrentValue: function (val, settings) {
          settings.shortBreak = val;
        }
      },
      longBreak: {
        elem: document.querySelector('.choose-block__option--long-break'),
        field: document.getElementById('long-break'),
        setCurrentValue: function (val, settings) {
          settings.longBreak = val;
        }
      }
    };

    // saved settings
    var data = {
      workTime: 0,
      workIter: 0,
      shortBreak: 0,
      longBreak: 0
    };

    // Event listeners
    elems.workTime.elem.addEventListener('click', function (e) {
      watcher(e, defaultSettings.workTime, elems.workTime);
    });

    elems.workIter.elem.addEventListener('click', function (e) {
      watcher(e, defaultSettings.workIter, elems.workIter);
    });

    elems.shortBreak.elem.addEventListener('click', function (e) {
      watcher(e, defaultSettings.shortBreak, elems.shortBreak);
    });

    elems.longBreak.elem.addEventListener('click', function (e) {
      watcher(e, defaultSettings.longBreak, elems.longBreak);
    });

    document.querySelector('.btn--save').addEventListener('click', function (e) {
      saveData(data, cycleSettings);
    });

    // Save settings
    function saveData(data, currentValue) {
      data.workTime = currentValue.workTime;
      data.workIter = currentValue.workIter;
      data.shortBreak = currentValue.shortBreak;
      data.longBreak = currentValue.longBreak;

      let updates = {
        'user/settings/longBreak': {
          'defaultValue': data.longBreak,
          'step': 5,
          'borders': {
            'max': 30,
            'min': 15
          }
        },
        'user/settings/shortBreak': {
          'defaultValue': data.shortBreak,
          'step': 1,
          'borders': {
            'max': 5,
            'min': 3
          }
        },
        'user/settings/workIter': {
          'defaultValue': data.workIter,
          'step': 1,
          'borders': {
            'max': 5,
            'min': 2
          }
        },
        'user/settings/workTime': {
          'defaultValue': data.workTime,
          'step': 5,
          'borders': {
            'max': 25,
            'min': 15
          }
        }
      };

        db.updateData(updates);
    }

    // Connect data to controllers
    function watcher(e, view, elems) {
      if (e.target.matches ? e.target.matches('.choose-block__controll--minus') : e.target.msMatchesSelector('.choose-block__controll--minus')) {
        decreaseValue(view, elems);
        render(cycleSettings);
      } else if (e.target.matches ? e.target.matches('.choose-block__controll--plus') : e.target.msMatchesSelector('.choose-block__controll--plus')) {
        increaseValue(view, elems);
        render(cycleSettings);
      }
    }

    // Increase value
    function increaseValue(viewField, elems) {
      if (elems.field.innerHTML < viewField.borders.max) {
        elems.field.innerHTML = parseInt(elems.field.innerHTML, 10) + viewField.step;
        elems.setCurrentValue(elems.field.innerHTML, cycleSettings);
      } else {
        return false;
      }
    }

    // Decrease value
    function decreaseValue(viewField, elems) {
      if (elems.field.innerHTML > viewField.borders.min) {
        elems.field.innerHTML = parseInt(elems.field.innerHTML, 10) - viewField.step;
        elems.setCurrentValue(elems.field.innerHTML, cycleSettings);
      } else {
        return false;
      }
    }

    // Cycle render
    function render(settings) {
      var cycle = settings.workIter * settings.workTime + (settings.workIter - 1) * settings.shortBreak; // full cycle time (minutes)
      var time = cycle * 2 + parseInt(settings.longBreak); // Total task time
      var length = 100 / time; // width to the minute
      var parent = settings.parent;
      var fCycle = [];
      var sCycle = [];

      // Clear page for every render
      clearArea(parent);

      var span = document.createElement('span');
      var workBlock = document.createElement('div');
      var shortBbreakBlock = document.createElement('div');
      var workBlock2 = document.createElement('div');
      var longBreakBlock = document.createElement('div');

      // Add time-containers
      createTimeBlocks(time, parent, span);

      workBlock.classList.add('cycle-block'); // ie11 doesn't support more then one argument in classList.add
      workBlock.classList.add('cycle-block--work');
      workBlock.style.width = settings.workTime * length + '%';
      shortBbreakBlock.classList.add('cycle-block');
      shortBbreakBlock.classList.add('cycle-block--short-break');
      shortBbreakBlock.style.width = settings.shortBreak * length + '%';
      workBlock2.classList.add('cycle-block');
      workBlock2.classList.add('cycle-block--work');
      workBlock2.style.width = settings.workTime * length + '%';
      longBreakBlock.classList.add('cycle-block');
      longBreakBlock.classList.add('cycle-block--long-break');
      longBreakBlock.style.width = settings.longBreak * length + '%';

      for (var i = 0; i < settings.workIter; i++) {
        fCycle.push(workBlock.cloneNode(true));
        sCycle.push(workBlock2.cloneNode(true));

        if (i !== settings.workIter - 1) {
          fCycle.push(shortBbreakBlock.cloneNode(true));
          sCycle.push(shortBbreakBlock.cloneNode(true));
        } else if (i == settings.workIter - 1) {
          span.innerHTML = 'First cycle: ' + getTimeFromMins(cycle + parseInt(settings.longBreak));
          span.classList.remove('last');
          longBreakBlock.appendChild(span.cloneNode(true));
          fCycle.push(longBreakBlock.cloneNode(true));
        }
      }

      for (var i = 0; i < fCycle.length; i++) {
        parent.appendChild(fCycle[i]);
      }

      for (var i = 0; i < sCycle.length; i++) {
        parent.appendChild(sCycle[i]);
      }
    }

    // Clear container
    function clearArea(area) {
      while (area.firstChild) {
        area.removeChild(area.firstChild);
      }
    }

    // Add time-containers
    function createTimeBlocks(time, parent, el) {
      for (var i = 0; i < Math.round(time / 30) + 1; i++) {
        el.style.left = (100 / Math.round(time / 30) * i + '%');
        el.innerHTML = getTimeFromMins(30 * i);

        if (i == Math.round(time / 30)) {
          el.classList.add('last');
        }

        parent.appendChild(el.cloneNode(true));
      }
    }

    // Transform minutes into 'hour + minute'
    function getTimeFromMins(mins) {

      // ie11 fix
      Math.trunc = Math.trunc || function (x) {
        return x - x % 1;
      }

      var hours = Math.trunc(mins / 60);
      var minutes = mins % 60;

      if (hours == 0) {
        return minutes + 'm';
      } else if (minutes == 0) {
        return hours + 'h';
      } else {
        return hours + 'h ' + minutes + 'm';
      }
    }
  }

  componentDidMount() {
    this.cycle()
  }

  switchPages(e) {
    this.props.onSwitchClick(e.target.textContent);
  }

  render() {
    return (
      <div className="wrapper main-wrapp">
        <section className="sticky-h">
          <h1>Settings</h1>
          <h2>Pomodoros settings</h2>
          <ul onClick={this.switchPages.bind(this)} className="mode-menu clearfix">
            <li className="mode-menu__item"><a href="#settings" className="active">Pomodoros</a></li>
            <li className="mode-menu__item"><a href="#categories">Categories</a></li>
          </ul>
          <ul className="choose-block clearfix">
            <li className="choose-block__option choose-block__option--work-time">
              <label htmlFor="work-time">work time</label><button
                className="icon choose-block__controll choose-block__controll--minus"></button><span className="choose-block__field" id="work-time"></span>
              <button className="icon choose-block__controll choose-block__controll--plus"></button>
              <p>Please select a value between 15 and 25 <span className="text--white">minutes</span></p>
            </li>
            <li className="choose-block__option choose-block__option--work-iteration">
              <label htmlFor="work-iteration">work iteration</label><button
                className="icon choose-block__controll choose-block__controll--minus"></button><span className="choose-block__field" id="work-iteration"></span><button
                  className="icon choose-block__controll choose-block__controll--plus"></button>
              <p>Please select a value between 2 and 5 <span className="text--white">iterations</span></p>
            </li>
            <li className="choose-block__option choose-block__option--short-break">
              <label htmlFor="short-break">short break</label><button
                className="icon choose-block__controll choose-block__controll--minus"></button><span className="choose-block__field" id="short-break"></span><button
                  className="icon choose-block__controll choose-block__controll--plus"></button>
              <p>Please select a value between 3 and 5 <span className="text--white">minutes</span></p>
            </li>
            <li className="choose-block__option choose-block__option--long-break">
              <label htmlFor="long-break">long break</label><button
                className="icon choose-block__controll choose-block__controll--minus"></button><span className="choose-block__field" id="long-break"></span><button
                  className="icon choose-block__controll choose-block__controll--plus"></button>
              <p>Please select a value between 15 and 30 <span className="text--white">minutes</span></p>
            </li>
          </ul>
        </section>

        <section className="cycle">
          <h2>Your cycle</h2>
          <div className="cycle__cont clearfix"></div>
          <div className="btn-cont">
            <a href="/taskList"><button className="btn btn--blue">Go to Tasks</button></a>
            <a href="/taskList"><button className="btn btn--green btn--save">Save</button></a>
          </div>
        </section>

      </div>
    );
  }
}

export default connect(
  state => ({
    triggerState: state.settingsPageTrigger.settingsSwitch
  }),
  dispatch => ({
    onSwitchClick: (value) => {
      dispatch(switchSettings(value));
    }
  })
)(Settings);
