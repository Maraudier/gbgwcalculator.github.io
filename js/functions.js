const formatDataTag = value => {
  return value.replace(/([A-Z])/g, match => '-' + match[0].toLowerCase());
};

const removeAllAttributes = el => {
  if (el.dataset) {
    for (let prop in el.dataset) {
      el.removeAttribute('data-' + formatDataTag(prop));
    }
  }
};

class GunplaCalculator {
  constructor() {
    this.containerEl = document.querySelector('.js-container');
    if (this.containerEl) {
      this._generateHTML();
    }
  }
  _generateHTML() {
    this._generate();
  }
  _createElement(config, targetEl) {
    const retEl = document.createElement(config.el);
    if ('class' in config) {
      if (Array.isArray(config.class)) {
        config.class.forEach(prop => retEl.classList.add(prop));
      } else if (typeof config.class === 'string') {
        retEl.classList.add(config.class);
      }
    }
    if ('text' in config) {
      retEl.textContent = config.text;
    }
    if ('type' in config) {
      retEl.type = config.type;
    }
    if ('readOnly' in config) {
      retEl.readOnly = config.readOnly;
    }
    if ('data' in config && Array.isArray(config.data)) {
      config.data.forEach(prop => {
        retEl.dataset[prop.name] = prop.value;
      });
    }
    if ('children' in config && Array.isArray(config.children)) {
      config.children.forEach(child => {
        this._createElement(child, retEl);
      });
    }
    if (targetEl && targetEl.append) {
      targetEl.append(retEl);
    }
  }
  _generate() {
    const columns = [this._wordTags(), this._partTrait(), this._info(), this._parts(), this._partList()];
    columns.forEach(column => {
      this._createElement(column, this.containerEl);
    });
  }
  _info() {
    return {
      'el': 'div',
      'class': 'info',
      'children': [{
        'el': 'h3',
        'text': 'Parameters'
      }, ...this._paramChildren(), {
        'el': 'h3',
        'text': 'Active Word Tag'
      }, {
        'el': 'div',
        'class': ['row', 'active-word-tag-list', 'js-active-wt']
      }, {
        'el': 'h3',
        'class': ['part-name', 'js-part-name']
      }, {
        'el': 'h3',
        'text': 'Parameters',
        'class': 'bg-red'
      }, ...this._paramChildren('part'), {
        'el': 'h3',
        'text': 'Word Tag',
        'class': 'bg-red'
      }, {
        'el': 'div',
        'class': ['row', 'part-word-tag-list', 'js-part-wt']
      }, {
        'el': 'h3',
        'text': 'Traits / EX Skill',
        'class': 'bg-red'
      }, {
        'el': 'div',
        'class': ['row', 'part-skill-trait', 'js-part-skill-trait']
      }]
    };
  }
  _paramChildren(type) {
    console.log('type', type);
    if (Array.isArray(Sorters)) {
      let sortClassPrefix = 'js-total-',
        alternateRowClass = 'alt-bg--blue';
      if (type && type == 'part') {
        sortClassPrefix = 'js-part-total-';
        alternateRowClass = 'alt-bg--red';
      }
      return Sorters.map(sorter => {
        return {
          'el': 'div',
          'class': ['row', alternateRowClass],
          'children': [{
            'el': 'div',
            'children': [{
              'el': 'label',
              'text': sorter.name
            }, {
              'el': 'span',
              'class': ['info__total', 'float-right', sortClassPrefix + sorter.slug],
              'text': 0
            }]
          }]
        };
      });
    }
  }
  _wordTags() {
    return {
      'el': 'div',
      'class': 'word-tags',
      'children': [{
        'el': 'h3',
        'text': 'Word Tags'
      }, ...MainSlot.map(wordTag => {
        return {
          'el': 'div',
          'class': ['row', 'height-50', 'alt-bg'],
          'children': [{
            'el': 'span',
            'class': 'js-wt-' + wordTag
          }]
        };
      })]
    };
  }
  _partTrait() {
    return {
      'el': 'div',
      'class': 'part-trait-ex-skill',
      'children': [{
        'el': 'h3',
        'text': 'Part Traits / EX Skill'
      }, ...MainSlot.map(trait => {
        return {
          'el': 'div',
          'class': ['row', 'height-50', 'alt-bg'],
          'children': [{
            'el': 'span',
            'class': ['part-trait-ex-skill__text', 'js-skill-trait-' + trait]
          }]
        };
      })]
    };
  }
  _parts() {
    return {
      'el': 'div',
      'class': 'parts',
      'children': [{
        'el': 'h3',
        'text': 'Parts'
      }, ...this._partsChildren(), {
        'el': 'h3',
        'text': 'Gears'
      }, ...this._gearsChildren(), this._attributeTally()]
    };
  }
  _partsChildren() {
    if (Array.isArray(MainSlot)) {
      return MainSlot.map(slot => {
        return {
          'el': 'div',
          'class': ['row', 'alt-bg', 'height-50', 'js-part-cont'],
          'children': [{
            'el': 'div',
            'children': [{
              'el': 'label',
              'text': slot != 'backpack' ? slot : 'back'
            }, {
              'el': 'input',
              'type': 'text',
              'class': 'js-input-' + slot,
              'readOnly': true
            }]
          }]
        };
      });
    }
  }
  _gearsChildren() {
    if (Array.isArray(GearSlot)) {
      return GearSlot.map((slotClass, slotIndex) => {
        return {
          'el': 'div',
          'class': ['row', 'height-50', 'js-part-cont'],
          'children': [{
            'el': 'div',
            'children': [{
              'el': 'label',
              'text': 'Slot ' + (slotIndex + 1)
            }, {
              'el': 'input',
              'type': 'text',
              'class': 'js-input-' + slotClass,
              'readOnly': true
            }]
          }]
        };
      });
    }
  }
  _attributeTally() {
    return {
      'el': 'div',
      'class': 'attribute-tally',
      'children': Attributes.map(tally => {
        return {
          'el': 'label',
          'text': '[' + tally.charAt(0) + '] ',
          'children': [{
            'el': 'span',
            'class': 'js-tally-' + tally.charAt(0).toLowerCase(),
            'text': 0
          }]
        };
      })
    };
  }
  _partList() {
    return {
      'el': 'div',
      'class': 'part-list',
      'children': [{
        'el': 'h3',
        'text': 'Part List',
        'children': [{
          'el': 'span',
          'text': 'Remove',
          'class': ['part-list__remove', 'js-remove-part']
        }]
      }, {
        'el': 'div',
        'class': ['part-list__list', 'js-part-list']
      }]
    };
  }
}

class GunplaBuild {
  constructor() {
    this.wordTagsTally = {};
    this.parametersTotal = {};
    this.attributesTally = {
      'p': 0,
      't': 0,
      's': 0
    };
    this.inputs = {};
    this.comboParts = [];
    this.parts = {};
    this.partList = document.querySelector('.js-part-list');
    this.partNameCont = document.querySelector('.js-part-name');
    this.partParamCont = {};
    this.partWTCont = document.querySelector('.js-part-wt');
    this.partSkillTraitCont = document.querySelector('.js-part-skill-trait');
    this.partCont = {};
    this.filters = {
      'attr': '',
      'wt1': '',
      'wt2': '',
      'pt': ''
    };
    this.applyMapBonus = false;
    this.sort = '';
    this.currentPart = '';
  }
  init() {
    Sorters.forEach(sorter => {
      this.partParamCont[sorter.slug] = document.querySelector('.js-part-total-' + sorter.slug);
    });
    AllSlots.forEach(slot => {
      this.inputs[slot] = document.querySelector('.js-input-' + slot);
      this.parts[slot] = [];
      this.partCont[slot] = this.inputs[slot].closest('.js-part-cont');
    });
    this._parseParts();
    console.log('this.parts', this.parts);
    this._initInputClick();
    this._initFilters();
    this._initSort();
    this._initApplyMapBonus();
    this._initRemove();
  }
  _parseParts() {
    if (AllSlots && Array.isArray(AllSlots)) {
      if (Collections && Array.isArray(Collections)) {
        Collections.forEach(gunpla => {
          if (gunpla.parts && Array.isArray(gunpla.parts)) {
            const currGunpla = {
              'ms': gunpla.name
            };
            for (let part in gunpla) {
              if (gunpla.hasOwnProperty(part) && part !== 'parts' && part !== 'name') {
                currGunpla[part] = gunpla[part];
              }
            }
            gunpla.parts.forEach(part => {
              const gunplaClone = {
                ...currGunpla
              };
              for (let prop in part) {
                if (part.hasOwnProperty(prop)) {
                  gunplaClone[prop] = part[prop];
                }
              }
              if (part.part) {
                this.parts[part.part].push(gunplaClone);
              }
            });
          }
        });
      }
      if (Pilots && Array.isArray(Pilots)) {
        Pilots.forEach(currPilot => {
          const pilotClone = {
            'part': 'pilot'
          };
          for (let prop in currPilot) {
            if (currPilot.hasOwnProperty(prop)) {
              pilotClone[prop] = currPilot[prop];
            }
          }
          this.parts.pilot.push(pilotClone);
        });
      }
      if (GearTypes && Array.isArray(GearTypes)) {
        GearTypes.forEach(currGear => {
          const gearClone = {
            'part': 'gear-s1ot1'
          };
          for (let prop in currGear) {
            if (currGear.hasOwnProperty(prop)) {
              gearClone[prop] = currGear[prop];
            }
          }
          this.parts['gear-s1ot1'].push(gearClone);
        });
      }
    }
  }
  _initInputClick() {
    const inputs = this.inputs;
    console.log('is', inputs);
    for (let input in inputs) {
      if (inputs.hasOwnProperty(input) && inputs[input]) {
        inputs[input].addEventListener('click', e => {
          this.currentPart = input;
          this._setSelectedPart(input);
          this._showPartList(input);
          this._displayPartInfo(e.currentTarget);
        });
      }
    }
  }
  _checkFilter(filterToCheck) {
    const filters = this.filters;
    if (this.filters.attr && filterToCheck.attribute && filterToCheck.attribute != this.filters.attr) {
      return false;
    }
    if (this.filters.wt1 && filterToCheck.wt && filterToCheck.wt.indexOf(this.filters.wt1) < 0) {
      return false;
    }
    if (this.filters.wt2 && filterToCheck.wt && filterToCheck.wt.indexOf(this.filters.wt2) < 0) {
      return false;
    }
    if (this.filters.pt && filterToCheck.ex && filterToCheck.ex['name'] && !new RegExp('\\b' + this.filters.pt + '\\b', 'i').test(filterToCheck.ex['name'])) {
      return false;
    }
    return true;
  }
  _showPartList(partToShow) {
    if (this.partList && Collections && Array.isArray(Collections)) {
      this.partList.innerHTML = '';
      if (this.parts && this.parts[partToShow] && Array.isArray(this.parts[partToShow])) {
        const partClone = [...this.parts[partToShow]],
          sortType = this.sort;
        if (sortType && GearSlot.indexOf(partToShow) < 0) {
          partClone.sort((partA, partB) => {
            return partA[sortType] > partB[sortType] ? -1 : 1;
          });
        }
        partClone.forEach(partFilter => {
          if (!this._checkFilter(partFilter)) {
            return;
          }
          const currTarget = document.createElement('div');
          currTarget.textContent = currTarget.dataset['partname'] = (partFilter.attribute
            ? '[' + partFilter.attribute.charAt(0) + ']'
            : '') + ' ' + (partFilter.ms
              ? partFilter.ms + (partFilter.name ? ' (' + partFilter.name + ')' : '')
              : partFilter.name) + (partFilter.jl
                ? ' (' + partFilter.jl + ')'
                : '');
          currTarget.classList.add('part-list__item');
          for (let prop in partFilter) {
            currTarget.dataset[prop] = partFilter[prop] instanceof Object ? JSON.stringify(partFilter[prop]) : partFilter[prop];
          }
          currTarget.addEventListener('click', e => {
            const currTarget = e.currentTarget;
            let partInput, partData;
            if (currTarget.dataset['part'] && this.inputs[currTarget.dataset['part']]) {
              partData = currTarget.dataset['part'];
              partInput = this.inputs[partData];
              partInput.value = partInput.title = currTarget.dataset['partname'];
              removeAllAttributes(partInput);
              Object.assign(partInput.dataset, currTarget.dataset);
              this._displayPartInfo(currTarget);
            }
            this._calculate(partData);
          });
          if (screen.width >= 992) {
            currTarget.addEventListener('mouseover', e => {
              this._displayPartInfo(e.currentTarget);
            });
          }
          this.partList.appendChild(currTarget);
        });
      }
    }
  }
  _setSelectedPart(partId) {
    console.log('_setSelectedPart');
    const partClass = 'selected-part';
    Array.prototype.slice.call(document.querySelectorAll('.selected-part')).forEach(selectedPart => {
      selectedPart.classList.remove(partClass);
    });
    if (this.partCont[partId]) {
      this.partCont[partId].classList.add(partClass);
    }
  }
  _calculate(partData) {
    this._toggleComboPart(partData);
    this._displaySkillTraits(partData);
    this._loopThroughInput();
    this._displayPartsWordTags();
  }
  _toggleComboPart(partData) {
    if (this.inputs[partData]) {
      const partInput = this.inputs[partData];
      if (Array.isArray(this.comboParts)) {
        for (let i = 0; i < this.comboParts.length; i++) {
          const comboPart = this.comboParts[i];
          if (comboPart.part && comboPart.combo && partInput.dataset['part']) {
            if (comboPart.part == partInput.dataset['part']) {
              document.querySelector('.js-input-' + comboPart.combo).disabled = false;
              this.comboParts.splice(i, 1);
              break;
            } else if (partInput.dataset['combo'] && partInput.dataset['combo'] == comboPart.combo) {
              this._clearParts(comboPart.part);
              document.querySelector('.js-input-' + comboPart.combo).disabled = false;
              this.comboParts.splice(i, 1);
              break;
            }
          }
        }
      }
      if (partInput.dataset['combo'] && partInput.dataset['part']) {
        this._clearParts(partInput.dataset['combo']);
        this.comboParts.push({
          'part': partInput.dataset['part'],
          'combo': partInput.dataset['combo']
        });
        document.querySelector('.js-input-' + partInput.dataset['combo']).disabled = true;
      }
    }
  }
  _displaySkillTraits(partData) {
    if (this.inputs[partData]) {
      const partInput = this.inputs[partData];
      let exData, partTrait;
      if (partInput && partInput.dataset['part'] && partInput.dataset['ex']) {
        partTrait = document.querySelector('.js-skill-trait-' + partInput.dataset['part']),
          exData = JSON.parse(partInput.dataset['ex']);
        if (exData.type && exData.name && partTrait) {
          partTrait.textContent = exData.name;
        }
      } else {
        this._clearSkillTrait(partData);
      }
    }
  }
  _clearSkillTrait(partData) {
    if (partData && document.querySelector('.js-skill-trait-' + partData)) {
      document.querySelector('.js-skill-trait-' + partData).textContent = '';
    }
  }
  _loopThroughInput() {
    const inputList = this.inputs;
    this._resetWordTagTally();
    this._resetParameters();
    this._resetAttributesTally();
    console.log('--------------------');
    for (let inputName in inputList) {
      if (inputList.hasOwnProperty(inputName) && this.inputs[inputName]) {
        const input = this.inputs[inputName];
        if (input) {
          console.log(Object.assign({}, input.dataset));
          this._tallyWordTags(input);
          this._calculateParameters(input);
          this._tallyAttributes(input);
        }
      }
    }
    this._displayWordTagsTally();
    this._displayParametersTotal();
    this._displayAttributesTally();
  }
  _resetWordTagTally() {
    this.wordTagsTally = {};
  }
  _tallyWordTags(inputName) {
    if (inputName && inputName.dataset['wt']) {
      const wordTags = JSON.parse(inputName.dataset['wt']),
        doubleForCombo = inputName.dataset['combo'] ? 2 : 1;
      if (Array.isArray(wordTags)) {
        wordTags.forEach(wordTag => {
          this.wordTagsTally[wordTag] = wordTag in this.wordTagsTally
            ? this.wordTagsTally[wordTag] + doubleForCombo
            : doubleForCombo;
        });
      }
    }
  }
  _displayWordTagsTally() {
    const activeWordTag = document.querySelector('.js-active-wt');
    activeWordTag.innerHTML = '';
    for (let tally in this.wordTagsTally) {
      if (this.wordTagsTally[tally] >= 5) {
        const tallyDiv = document.createElement('div');
        tallyDiv.textContent = tally;
        activeWordTag.appendChild(tallyDiv);
      }
    }
    console.log('this.wordTagsTally', this.wordTagsTally);
  }
  _resetParameters() {
    this.parametersTotal = {};
    Sorters.forEach(sorter => {
      if ('slug' in sorter) {
        this.parametersTotal[sorter.slug] = 0;
      }
    });
  }
  _calculateParameters(inputName) {
    if (inputName) {
      Sorters.forEach(sorter => {
        const slug = sorter.slug;
        if (slug && inputName.dataset[slug] && slug in this.parametersTotal) {
          this.parametersTotal[slug] += +inputName.dataset[slug];
        }
      });
    }
  }
  _displayParametersTotal() {
    this._applyWordTagBonus();
    this._applyJobLicenseBonus();
    for (let paramTotal in this.parametersTotal) {
      document.querySelector('.js-total-' + paramTotal).textContent = this.parametersTotal[paramTotal];
    }
  }
  _resetAttributesTally() {
    this.attributesTally = {
      'p': 0,
      't': 0,
      's': 0
    };
  }
  _tallyAttributes(partData) {
    if (partData && partData.dataset['attribute'] && partData.dataset.attribute.charAt(0).toLowerCase() in this.attributesTally) {
      const doubleForCombo = partData.dataset['combo'] ? 2 : 1;
      this.attributesTally[partData.dataset['attribute'].charAt(0).toLowerCase()] += doubleForCombo;
    }
  }
  _displayAttributesTally() {
    for (let tally in this.attributesTally) {
      document.querySelector('.js-tally-' + tally).textContent = this.attributesTally[tally];
    }
  }
  _applyWordTagBonus() {
    const tallyMap = {};
    console.log('Total Raw Attributes:', this.parametersTotal);
    let tagTally = 0;
    for (let tagName in this.wordTagsTally) {
      if (this.wordTagsTally[tagName] >= 5) {
        const foundTag = this._getWordTag(tagName);
        if (MapWordTags.indexOf(tagName) > -1) {
          tagTally++;
        }
        if (foundTag && foundTag.multiplier && foundTag.parameters && Array.isArray(foundTag.parameters)) {
          foundTag.parameters.forEach(tagParam => {
            tallyMap[tagParam] = tagParam in tallyMap
                ? Math.round((tallyMap[tagParam] + foundTag.multiplier) * 1000000000000) / 1000000000000
                : foundTag.multiplier;
          });
        }
      }
    }
    if (tagTally && this.applyMapBonus && Array.isArray(Sorters)) {
      Sorters.forEach(sorter => {
        tallyMap[sorter.slug] = tallyMap[sorter.slug]
            ? Math.round((tallyMap[sorter.slug] + 0.03) * 1000000000000) / 1000000000000
            : 0.03;
      });
    }
    console.log('Word Tag Multipliers', tallyMap);
    for (let tag in tallyMap) {
      if (tag in this.parametersTotal) {
        this.parametersTotal[tag] = Math.round(this.parametersTotal[tag] + this.parametersTotal[tag] * tallyMap[tag]);
      }
    }
    console.log('Total Attributes With WT Bonus:', this.parametersTotal);
  }
  _getWordTag(wordTag) {
    return WordTagData.find(tag => wordTag === tag.name);
  }
  _applyJobLicenseBonus() {
    const selectedPilot = document.querySelector('.js-select-pilot'),
      pilotInput = this.inputs.pilot;
    if (pilotInput && pilotInput.dataset['jl']) {
      const jobLicense = this._getJobLicense(pilotInput.dataset['jl']);
      if (jobLicense && jobLicense.multiplier && jobLicense.parameters && Array.isArray(jobLicense.parameters)) {
        jobLicense.parameters.forEach(jobParam => {
          if (jobParam in this.parametersTotal) {
            this.parametersTotal[jobParam] = Math.round(this.parametersTotal[jobParam] + this.parametersTotal[jobParam] * jobLicense.multiplier);
          }
        });
      }
    }
    console.log('Total Attributes With WT Bonus and Job Bonus:', this.parametersTotal);
  }
  _getJobLicense(license) {
    return PilotType.find(type => license === type.name);
  }
  _displayPartsWordTags() {
    const input = this.inputs;
    for (let props in input) {
      if (input.hasOwnProperty(props)) {
        const inputData = this.inputs[props];
        if (inputData) {
          if (!this._displayWordTags(inputData) && input[props].disabled == false) {
            this._clearWordTag(props);
          }
        }
      }
    }
  }
  _clearWordTag(wordTag) {
    if (document.querySelector('.js-wt-' + wordTag)) {
      document.querySelector('.js-wt-' + wordTag).innerHTML = '';
    }
  }
  _clearParts(inputName) {
    if (inputName && inputName in this.inputs) {
      const input = this.inputs[inputName];
      input.value = '';
      input.title = '';
      removeAllAttributes(input);
      Object.assign(input.dataset, document.createElement('input')['dataset']);
      this._clearSkillTrait(inputName);
      this._clearWordTag(inputName);
    }
  }
  _initFilters() {
    const attrFilter = document.querySelector('.js-filter-attr'),
      wtFilter1 = document.querySelector('.js-filter-wt1'),
      wtFilter2 = document.querySelector('.js-filter-wt2'),
      ptFilter = document.querySelector('.js-filter-pt');
    if (Array.isArray(Attributes)) {
      Attributes.forEach(attr => {
        const opt = document.createElement('option');
        opt.value = attr;
        opt.text = attr;
        attrFilter.appendChild(opt);
      });
    }
    if (Array.isArray(GeneralWordTags)) {
      GeneralWordTags.sort();
      GeneralWordTags.forEach(wt => {
        const opt = document.createElement('option');
        opt.value = wt;
        opt.text = wt;
        wtFilter2.appendChild(opt.cloneNode(true));
        wtFilter1.appendChild(opt);
      });
    }
    if (Array.isArray(TraitDescriptions)) {
      TraitDescriptions.forEach(pt => {
        const opt = document.createElement('option');
        opt.value = pt;
        opt.text = pt;
        ptFilter.appendChild(opt);
      });
    }
    for (let filter in this.filters) {
      if (this.filters.hasOwnProperty(filter)) {
        document.querySelector('.js-filter-' + filter).addEventListener('change', e => {
          this.filters[filter] = e.currentTarget.value;
          if (this.currentPart) {
            this._showPartList(this.currentPart);
          }
          console.log('this.filters', this.filters);
        });
      }
    }
  }
  _initSort() {
    const sortParamEl = document.querySelector('.js-sort-param');
    if (Array.isArray(Sorters)) {
      Sorters.forEach(sorter => {
        const opt = document.createElement('option');
        opt.value = sorter.slug;
        opt.text = sorter.name;
        sortParamEl.appendChild(opt);
      });
      sortParamEl.addEventListener('change', e => {
        this.sort = e.currentTarget.value;
        if (this.currentPart) {
          this._showPartList(this.currentPart);
        }
      });
    }
  }
  _initApplyMapBonus() {
    const applyMapBonusEl = document.querySelector('.js-apply-map-bonus');
    applyMapBonusEl.checked = false;
    applyMapBonusEl.addEventListener('change', e => {
      this.applyMapBonus = e.currentTarget.checked;
      this._loopThroughInput();
    });
  }
  _initRemove() {
    const removePartEl = document.querySelector('.js-remove-part');
    removePartEl.addEventListener('click', e => {
      console.log('this.currentPart', this.currentPart);
      const currPart = this.currentPart;
      if (currPart && Array.isArray(AllSlots) && AllSlots.indexOf(currPart) > -1) {
        const partInputEl = document.querySelector('.js-input-' + currPart);
        if (partInputEl && partInputEl.dataset['combo']) {
          document.querySelector('.js-input-' + partInputEl.dataset['combo']).disabled = false;
          for (let i = 0; i < this.comboParts.length; i++) {
            if (this.comboParts[i]['part'] == currPart) {
              this.comboParts.splice(i, 1);
              break;
            }
          }
          console.log('this.comboParts', this.comboParts);
        }
        this._clearParts(currPart);
        this._loopThroughInput();
        this._displayPartsWordTags();
      }
    });
  }
  _displayPartInfo(part) {
    if (part && part.dataset['part'] && MainSlot.indexOf(part.dataset['part']) > -1) {
      const wordTag = JSON.parse(part.dataset['wt']),
        ex = JSON.parse(part.dataset['ex']);
      this.partNameCont.textContent = part.dataset['partname'] ? part.dataset['partname'] : '';
      Sorters.forEach(sorter => {
        this.partParamCont[sorter.slug].textContent = part.dataset[sorter.slug] ? part.dataset[sorter.slug] : 0;
      });
      if (Array.isArray(wordTag)) {
        this.partWTCont.innerHTML = wordTag.reduce((result, tag) => {
          return result + '<div>' + tag + '</div>';
        }, '');
      } else {
        this.partWTCont.innerHTML = '';
      }
      this.partSkillTraitCont.textContent = ex.type && ex.name ? ex.name : '';
    }
  }
  _displayWordTags(part) {
    if (!(part && part.dataset['part'] && part.dataset['wt'])) {
      return false;
    }
    const partEl = document.querySelector('.js-wt-' + part.dataset['part']),
      wordTags = JSON.parse(part.dataset['wt']);
    if (Array.isArray(wordTags) && partEl) {
      partEl.innerHTML = wordTags.reduce((result, wordTag) => {
        const currentTally = this.wordTagsTally[wordTag];
        return result + ((result == '' ? '' : '<br />') + '<span class="' + (currentTally >= 5 ? 'activatedWT' : '') + '">(' + currentTally + ') ' + wordTag + '</span>');
      }, '');
      if (part.dataset.combo) {
        document.querySelector('.js-wt-' + part.dataset['combo']).innerHTML = partEl.innerHTML;
      }
    }
    return true;
  }
}