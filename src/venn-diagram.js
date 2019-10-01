
import { html, render } from 'lit-html';
import * as R from 'ramda';
import * as d3 from 'd3';
import * as venn from 'venn.js';

class VennDiagram extends window.HTMLElement {
  constructor () {
    super();
    this.data = [
      { sets: ['Source A'], size: 120 },
      { sets: ['Source B'], size: 120 },
      { sets: ['Source A', 'Source B'], size: 20 }
    ];
  }

  connectedCallback () {
    render(this.template(), this, { eventContext: this });
    this.chart = venn.VennDiagram();
    const div = d3.select('#venn');
    div.datum(this.data).call(this.chart);
    this.addTooltip();
  }

  template () {
    return html`
    <div id="venn" @onUpdateChart=${this.update}></div>
    `;
  }

  update (event) {
    const comparisonField = event.detail.commonFieldValue || 'nope';
    const sourceOne = event.detail.dataFiles[0];
    const sourceTwo = event.detail.dataFiles[1];
    const union = R.unionWith(R.eqBy(R.prop(comparisonField)), sourceOne.data, sourceTwo.data);
    const symmetricDifference = R.symmetricDifferenceWith(R.eqBy(R.prop(comparisonField)), sourceOne.data, sourceTwo.data);
    const updateData = [
      { sets: [sourceOne.name], size: sourceOne.data.length },
      { sets: [sourceTwo.name], size: sourceTwo.data.length },
      { sets: [sourceOne.name, sourceTwo.name], size: union.length - symmetricDifference.length }
    ];
    d3.select('#venn').datum(updateData).call(this.chart);
    this.addTooltip();
  }

  addTooltip () {
    const div = d3.select('#venn');
    const tooltip = d3.select('body').append('div')
      .attr('class', 'venntooltip');

    // add listeners to all the groups to display tooltip on mouseover
    div.selectAll('g')
      .on('click', function (d, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(div, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(400).style('opacity', 0.9);
        tooltip.text(d.size + ' doc');

        // highlight the current path
        var selection = d3.select(this).transition('tooltip').duration(400);
        selection.select('path')
          .style('stroke-width', 3)
          .style('fill-opacity', d.sets.length === 1 ? 0.4 : 0.1)
          .style('stroke-opacity', 1);
      })
      .on('mousemove', function () {
        tooltip.style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function (d, i) {
        tooltip.transition().duration(200).style('opacity', 0);
        var selection = d3.select(this).transition('tooltip').duration(200);
        selection.select('path')
          .style('stroke-width', 0)
          .style('fill-opacity', d.sets.length === 1 ? 0.25 : 0.0)
          .style('stroke-opacity', 0);
      });
  }
}

window.customElements.define('venn-diagram', VennDiagram);
