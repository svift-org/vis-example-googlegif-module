SVIFT.vis.example.googlegif = (function (data, container) {
 
  // Module object
  var module = SVIFT.vis.base(data, container);
 
  module.goal = 0;
  module.steps = [];
  module.width = 0;

  module.setup = function () {
    module.goal = Math.random()*100;
    for(var i = 0; i<5; i++){
      module.steps.push( {value: module.goal - ((Math.random()>0.5)?-(100-module.goal):module.goal) * Math.random()/2, duration:Math.random()} );
    }
    console.log(module.goal, module.steps);

    module.g.selectAll('rect').data([0,1]).enter().append('rect')
      .attr('id',function(d){ return (d===0)?'left':'right'; })
      .attr('width', 50)
      .attr('height', 50)
      .attr('y', 0)
      .attr('x', 0)
      .style('stroke','transparent')
      .style('fill',function(d){ return (d===0)?'#D94949':'#60BB2B'; });
  };

  module.resize = function () {
    var width = module.container.node().offsetWidth,
      height = module.container.node().offsetHeight;

    module.width = width;

    module.g.selectAll('rect')
      .attr('height',height);

    var interLeft = [{value:0}], interRight = [{value:0}];

    module.steps.forEach(function(step){
      interLeft.push({value:width/100*step.value, duration:step.duration, ease:d3.easeCubicInOut});
      interRight.push({value:width/100*(100-step.value), duration:step.duration, ease:d3.easeCubicInOut});
    })
    
    interLeft.push({value:width/100*module.goal, duration:Math.random(), ease:d3.easeCubicInOut});
    interRight.push({value:width/100*(100-module.goal), duration:Math.random(), ease:d3.easeCubicInOut});

    module.timeline.leftRect.obj.interpolate = SVIFT.helper.interpolate(interLeft);
    module.timeline.rightRect.obj.interpolate = SVIFT.helper.interpolate(interRight);

    if(!module.playState){
      module.draw(module.playHead);
    }
  };

  module.drawLeftRect = function(t){
    module.g.select('#left').attr('width', module.timeline.leftRect.obj.interpolate(t));
  };

  module.drawRightRect = function(t){
    module.g.select('#right')
      .attr('width', module.timeline.rightRect.obj.interpolate(t))
      .attr('x', module.width - module.timeline.rightRect.obj.interpolate(t));
  };

  module.timeline = {
    leftRect: {start:0, end:5000, func:module.drawLeftRect, obj:{interpolate:null}},
    rightRect: {start:0, end:5000, func:module.drawRightRect, obj:{interpolate:null}}
  };

  return module;
 });