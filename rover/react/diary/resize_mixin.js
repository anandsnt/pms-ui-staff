var Resize = {
  componentDidUpdate: function(props, state) {
      if(this.state.resize.active && !state.resize.active) {
        (function() {
          var els = this.state.resize.el,
              left = els.left,
              right = els.right;

              left.addEventListener('mousedown', this.onResizeDownLeft);
              left.addEventListener('mousemove', this.onResizeMoveLeft);
              left.addEventListener('mouseup', this.onResizeUpLeft);
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
              left.removeEventListener('mouseup', this.onResizeUpLeft);
              right.removeEventListener('mousedown', this.onResizeDownRight);
              right.removeEventListener('mousemove', this.onResizeMoveRight);
              right.removeEventListener('mouseup', this.onResizeUpRight);

              $(left).remove();
              $(right).remove();
        }).apply(this);       
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
      });
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
      });     
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
  __createDivs: function() {


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
};