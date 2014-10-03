var Draggable = {
  // we could get away with not having this (and just having the listeners on
  // our div), but then the experience would be possibly be janky. If there's
  // anything w/ a higher z-index that gets in the way, then you're toast,
  // etc.
  componentDidMount: function() {
    this.dbMouseMove = _.debounce(this.__onMouseMove, 10);
  },
  componentDidUpdate: function (props, state) {
    var old_state = state,
        new_state = this.state;

    if (new_state.dragging && !old_state.dragging) {
      document.addEventListener('mousemove', this.dbMouseMove);
      document.addEventListener('mouseup', this.__onMouseUp);
    } else if (!new_state.dragging && old_state.dragging) {
      document.removeEventListener('mousemove', this.dbMouseMove);
      document.removeEventListener('mouseup', this.__onMouseUp);
    }
  },

  // calculate relative position to the mouse and set dragging=true
  __onMouseDown: function (e) {
    var el = $(this.getDOMNode()),
        pos = el.offset(),
        grid = el.parent().parent().parent(),
        props = this.props,
        state = this.state;

    // only left mouse button
    if (e.button !== 0) { 
      return;
    }
   
    /*Send current data drag item to Parent(s)*/
    props.__onDragStart(props.data);

    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top 
      }
    });

    e.stopPropagation();
    e.preventDefault();    
  },
  __onMouseUp: function (e) { 
    if(this.state.dragging) {
      this.setState({ 
        dragging: false 
      });

      e.stopPropagation();
      e.preventDefault();
    }
  },
  __onMouseMove: function (e) {
    if(this.state.dragging) {

      this.setState({
        pos: { 
          x: ((e.pageX - this.state.rel.x) / this.props.display.px_per_int).toFixed()*this.props.display.px_per_int,
          y: ((e.pageY - this.state.rel.y - this.state.y_offset) / 80).toFixed()*80
        }
      });

      e.stopPropagation();
      e.preventDefault();
    } 
  }
};
