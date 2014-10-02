var Draggable = {
  // we could get away with not having this (and just having the listeners on
  // our div), but then the experience would be possibly be janky. If there's
  // anything w/ a higher z-index that gets in the way, then you're toast,
  // etc.
  componentDidMount: function() {
    this.dbMouseMove = _.debounce(this.onMouseMove, 10);
  },
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.dbMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.dbMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    } else{
      if(this.state.resize.active && !state.resize.active) {
        (function() {
          var els = this.state.resize.el,
              left = els.left,
              right = els.right;

              left.addEventListener('mousedown', this.onResizeDownLeft);
              left.addEventListener('mousemove', this.onResizeMoveLeft);
              left.addEventListener('mouseup', this.onResizeUpLeft)
              right.addEventListener('mousedown', this.onResizeDownRight);
              right.addEventListener('mousemove', this.onResizeMoveRight);
              right.addEventListener('mouseup', this.onResizeUpRight);
        }).apply(this);

        console.log(this.state.resize);
      } else if(!this.state.resize.active && state.resize.active) {
         (function() {
          var els = this.state.resize.el,
              left = els.left,
              right = els.right;

              left.removeEventListener('mousedown', this.onResizeDownLeft);
              left.removeEventListener('mousemove', this.onResizeMoveLeft);
              left.removeEventListener('mouseup', this.onResizeUpLeft)
              right.removeEventListener('mousedown', this.onResizeDownRight);
              right.removeEventListener('mousemove', this.onResizeMoveRight);
              right.removeEventListener('mouseup', this.onResizeUpRight);

              $(left).remove();
              $(right).remove();
        }).apply(this);       
      }
    }
  },
  onResizeDownLeft: function(e) {
    var el = this.state.resize.el.left,
        pos = $(el).offset();

    this.setState({ 
      resize: { 
        active: true,
        dragging: true,
        direction: 'left', 
        left: e.pageX -  pos.left, 
        el: {
          left: el,
          right: this.state.resize.el.right
        }
      } 
    });
  },
  onResizeDownRight: function(e) {
    var el = this.state.resize.el.right,
        pos = $(el).offset();

    this.setState({ 
      resize: { 
        active: true,
        dragging: true,
        direction: 'right', 
        left: e.pageX - (pos.left + 30) ,
        el: {
          left: this.state.resize.el.left,
          right: el
        }
      } 
    });
  },
  onResizeMoveLeft: function(e) {
    var delta = 0,
        resize = this.state.resize;

    if(resize.active && 
       resize.direction === 'left' &&
       resize.dragging) {
      
      console.log('resize move left');

      delta = e.pageX - this.state.resize.left;

      this.setState({
        pos: {
          x: e.pageX - delta,
          width: this.state.width + delta
        }
      })
    }
  },
  onResizeMoveRight: function(e) {
    var delta = 0,
        resize = this.state.resize;

    if(resize.active && 
       resize.direction === 'right' &&
       resize.dragging) {

      console.log('resize move right');

      delta = e.pageX - this.state.resize.left;

      this.setState({
        pos: {
          x: e.pageX - this.state.resize.left,
          width: this.state.width - delta
        }
      })     
    }
  },
  onResizeUpLeft: function(e) {
    var resize = this.state.resize;

    this.setState({
      resize: { 
        active: false,
        dragging: false,
        direction: 'right', 
        left: resize.left,
        el: {
          left: resize.el.left,
          right: resize.el.right
        }
      } 
    });
    console.log('resize up left', resize);
  },
  onResizeUpRight: function(e) {
    var resize = this.state.resize;

    this.setState({
      resize: { 
        active: false,
        dragging: false,
        direction: 'right', 
        left: resize.left,
        el: {
          left: resize.el.left,
          right: resize.el.right
        }
      } 
    });

    console.log('resize up right', resize);
  },
  // calculate relative position to the mouse and set dragging=true
  onMouseDown: function (e) {
    var el = $(this.getDOMNode()),
        pos = el.offset(),
        grid = el.parent().parent().parent(),
        props = this.props,
        state = this.state;

    // only left mouse button
    if (e.button !== 0) return;

    if(this.state.mode === MODES[0]) {
      

      this.setState({
        dragging: true,
        rel: {
          x: e.pageX - pos.left,
          y: e.pageY - pos.top 
        }
      });

      e.stopPropagation();
      e.preventDefault();
    } else if(state.mode === MODES[1]) {


      $('<div id="resize-left" class="resize-bar left" style="left:' + state.pos.left + 'px; ' + 
                                                             'top:' + props.display.row_height + 'px; ' + 
                                                             'height:' + state.y_offset + 'px;"></div>').appendTo(grid);
 
      $('<div id="resize-right" class="resize-bar right" style="left:' + (state.pos.left + state.dim.width - 30.0) + 'px; ' +
                                                              'top:' + props.display.row_height + 'px; ' + 
                                                              'height:' + state.y_offset + 'px;"></div>').appendTo(grid);     

      this.setState({
        resize: {
          active: true,
          dragging: false,
          el: {
            left: document.getElementById('resize-left'),
            right: document.getElementById('resize-right')
          }
        }
      });
    }
  },
  onMouseUp: function (e) {
    this.setState({ dragging: false });

    e.stopPropagation();
    e.preventDefault();
  },
  onMouseMove: function (e) {
    if (!this.state.dragging && !this.state.resize.active) return;

    if(this.state.dragging) {
      this.setState({
        pos: { 
          x: e.pageX - this.state.rel.x,
          y: ((e.pageY - this.state.rel.y - this.state.y_offset) / 80).toFixed()*80
        }
      });
    } 

    e.stopPropagation();
    e.preventDefault();
  },
  _calculateDropRow: function(e) {
    var row_height = this.props.row_height,
        cur_y_offset = e.pageX + this.props.y_offset;
  },
  checkDropCoordinates: function(row) {

  }
  /*render: function () {
    // transferPropsTo will merge style & other props passed into our
    // component to also be on the child DIV.
    return this.transferPropsTo(React.DOM.div({
      onMouseDown: this.onMouseDown,
      style: {
        position: 'absolute',
        left: this.state.pos.x + 'px',
        top: this.state.pos.y + 'px'
      }
    }, this.props.children));
  }*/
};

/*React.renderComponent(Draggable({
    initialPos: {x: 100, y: 200},
    className: 'my-draggable',
    style: {
        border: '2px solid #aa5',
        padding: '10px'
    }
}, 'Drag Me! See how children are passed through to the div!'), document.body)
*/