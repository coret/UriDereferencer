'use strict'

UriDereferencer.addService({
    getName() {
        // https://www.wikidata.org/wiki/Wikidata:Main_Page
        return 'Wikidata';
    },
    getOptions() {
        return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://www.wikidata.org/wiki/Special:EntityData/${match[1]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (UriDereferencer.isset(() => json['entities'][match[1]]['labels']['en']['value'])) {
            data.set('Label', json['entities'][match[1]]['labels']['en']['value']);
        }
        if (UriDereferencer.isset(() => json['entities'][match[1]]['descriptions']['en']['value'])) {
            data.set('Description', json['entities'][match[1]]['descriptions']['en']['value']);
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/www\.wikidata\.org\/wiki\/(Q.+)/);
    }
});
UriDereferencer.addService({
    authorities: [
        // Subjects, Thesauri, Classification
        'subjects', 'classification', 'childrensSubjects', 'performanceMediums',
        // Agents
        'names',
        // Genre
        'genreForms',
        // Cataloging
        'demographicTerms',
    ],
    vocabularies: [
        // Subjects, Thesauri, Classification
        'graphicMaterials', 'ethnographicTerms', 'subjectSchemes',
        'classSchemes',
        // Agents
        'organizations',
        // Genre
        'marcgt', 'genreFormSchemes',
        // Languages
        'languages', 'iso639-1', 'iso639-2', 'iso639-5',
        // Geographic
        'countries', 'geographicAreas',
        // Cataloging
        'maspect', 'marcauthen', 'mbroadstd', 'carriers', 'mcolor',
        'contentTypes', 'descriptionConventions', 'mcapturestorage', 'menclvl',
        'mfont', 'mfiletype', 'mgeneration', 'mgroove', 'mstatus', 'millus',
        'maudience', 'issuance', 'mlayout', 'mediaTypes', 'mmusnotation',
        'mmusicformat', 'mplayback', 'mplayspeed', 'mpolarity', 'mpresformat',
        'mproduction', 'mprojection', 'frequencies', 'mrecmedium', 'mrectype',
        'mreductionratio', 'mregencoding', 'relators', 'mrelief',
        'resourceComponents', 'mscale', 'mscript', 'msoundcontent',
        'mspecplayback', 'msupplcont', 'mmaterial', 'mtactile', 'mtapeconfig',
        'mtechnique', 'mvidformat',
        // Preservation Vocabularies
        'preservation', // we get the rest for free!
    ],
    resources: [
        'works', 'instances', 'items',
    ],
    getName() {
        // http://id.loc.gov/
        return 'LC Linked Data Service';
    },
    getOptions() {
        return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `http://id.loc.gov/${match[1]}/${match[2]}/${match[3]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const index = json.findIndex(function(element) {
            // The relevant data is indexed by the URI set on the @id.
            return uri.replace(/\.html$/, '') == element['@id'];
        });
        const data = new Map();
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2000/01/rdf-schema#label'][0]['@value'])) {
            data.set('Label', json[index]['http://www.w3.org/2000/01/rdf-schema#label'][0]['@value']);
        }
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'])) {
            data.set('Pref label', json[index]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value']);
        }
        const altLabels = [];
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2008/05/skos-xl#altLabel'])) {
            for (let altLabel of json[index]['http://www.w3.org/2008/05/skos-xl#altLabel']) {
                if (altLabel['@value']) {
                    altLabels.push(altLabel['@value']);
                }
            }
            if (altLabels) {
                data.set('Alt Label', altLabels.join('; '));
            }
        }
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#definition'][0]['@value'])) {
            data.set('Definition', json[index]['http://www.w3.org/2004/02/skos/core#definition'][0]['@value']);
        }
        if (UriDereferencer.isset(() => json[index]['http://www.w3.org/2004/02/skos/core#note'][0]['@value'])) {
            data.set('Note', json[index]['http://www.w3.org/2004/02/skos/core#note'][0]['@value']);
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        const re = new RegExp(`^http?:\/\/id\.loc\.gov\/(authorities|vocabulary|resources)\/(${this.authorities.join('|')}|${this.vocabularies.join('|')}|${this.resources.join('|')})\/(.+?)(\.html)?$`);
        return uri.match(re);
    }
});
UriDereferencer.addService({
    getName() {
        // https://wiki.dbpedia.org/
        return 'DBpedia';
    },
    getOptions() {
        return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `http://dbpedia.org/data/${match[1]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (UriDereferencer.isset(() => json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#label'])) {
            for (let label of json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#label']) {
                if ('en' === label['lang']) {
                    data.set('Label', label['value']);
                }
            }
        }
        if (UriDereferencer.isset(() => json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#comment'])) {
            for (let comment of json[`http://dbpedia.org/resource/${match[1]}`]['http://www.w3.org/2000/01/rdf-schema#comment']) {
                if ('en' === comment['lang']) {
                    data.set('Comment', comment['value']);
                }
            }
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        // Does not support Category URLs
        return uri.match(/^https?:\/\/dbpedia\.org\/page\/((?!Category:).+)$/);
    }
});
UriDereferencer.addService({
    getName() {
        // https://www.getty.edu/research/tools/vocabularies/
        return 'Getty Vocabularies';
    },
    getOptions() {
        return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        // Note that Getty doesn't enable cross-origin resource sharing (CORS),
        // so we can't directly fetch the JSON representations. Use the SPARQL
        // endpoint instead.
        const match = this.getMatch(uri);
        const sparql = `
        SELECT ?Subject ?Term ?ScopeNote {
            ?Subject a skos:Concept ;
            skos:inScheme ${match[1]}: ;
            dc:identifier "${match[2]}" ;
            skosxl:prefLabel [xl:literalForm ?Term] .
            OPTIONAL {?Subject skos:scopeNote [
                dct:language gvp_lang:en;
                rdf:value ?ScopeNote]
            }
        }`;
        return `http://vocab.getty.edu/sparql.json?query=${encodeURIComponent(sparql)}`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (UriDereferencer.isset(() => json['results']['bindings'][0]['Term']['value'])) {
            data.set('Term', json['results']['bindings'][0]['Term']['value']);
        }
        if (UriDereferencer.isset(() => json['results']['bindings'][0]['ScopeNote']['value'])) {
            data.set('Scope note', json['results']['bindings'][0]['ScopeNote']['value']);
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/vocab\.getty\.edu\/(aat|tgn|ulan)\/(.+)$/);
    }
});
UriDereferencer.addService({
    getName() {
        // https://www.geonames.org/
        return 'Geonames';
    },
    getOptions() {
        // Must use the proxy because responses sent from Geonames don't
        // include an Access-Control-Allow-Origin header.
        return {'useProxy': true};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        // Note that Geonames does not provide a JSON representation. Use the
        // RDF representation instead.
        const match = this.getMatch(uri);
        return `http://www.geonames.org/${match[1]}/about.rdf`;
    },
    getMarkup(uri, text) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const data = new Map();
        data.set('Name', this.getNodeText(xmlDoc, '//gn:Feature/gn:name'));
        data.set('Official name', this.getNodeText(xmlDoc, '//gn:Feature/gn:officialName[lang("en")]'));
        data.set('Latitude', this.getNodeText(xmlDoc, '//gn:Feature/wgs84_pos:lat'));
        data.set('Longitude', this.getNodeText(xmlDoc, '//gn:Feature/wgs84_pos:long'));
        data.set('Altitude', this.getNodeText(xmlDoc, '//gn:Feature/wgs84_pos:alt'));
        let dataMarkup = '';
        for (let [key, value] of data) {
            if (null !== value) {
                dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`;
            }
        }
		return '<p><strong>Een term uit <a target="uri-dereference" href="'+uri+'">'+ this.getName()+ '</a>:</strong></p><dl>'+dataMarkup+'</dl>';
        //return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
      return uri.match(/^https?:\/\/[sw]w[sw]\.geonames\.org\/(.+?)(?:\/.+\.html)?$/);
    },
    getNodeText(xmlDoc, xpathExpression) {
        const namespaceResolver = function(prefix) {
            const ns = {
                'gn': 'http://www.geonames.org/ontology#',
                'wgs84_pos': 'http://www.w3.org/2003/01/geo/wgs84_pos#',
            };
            return ns[prefix] || null;
        };
        const xpathResult = xmlDoc.evaluate(xpathExpression, xmlDoc, namespaceResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return xpathResult.singleNodeValue ? xpathResult.singleNodeValue.textContent : null;
    }
});
UriDereferencer.addService({
    getName() {
        // https://www.oclc.org/en/viaf.html
        return 'OCLC VIAF';
    },
    getOptions() {
        // Must use the proxy because responses sent from OCLC VIAF don't
        // include an Access-Control-Allow-Origin header.
        return {'useProxy': true};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://viaf.org/viaf/${match[1]}/viaf.json`;
    },
    getMarkup(uri, text) {
        // Note that we're prioritizing Library of Congress (LC) as the source.
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
        if (UriDereferencer.isset(() => json['mainHeadings']['data'])) {
            const headings = [];
            for (let heading of json['mainHeadings']['data']) {
                if (heading['sources']['s'].includes('LC')) {
                    headings.push(heading['text']);
                }
            }
            if (headings.length) {
                data.set('Main headings', headings.join('; '));
            }
        }
        if (UriDereferencer.isset(() => json['nameType'])) {
            data.set('Name type', json['nameType']);
        }
        if (UriDereferencer.isset(() => json['fieldOfActivity']['data'])) {
            let retrievedData = json['fieldOfActivity']['data'];
            if (!Array.isArray(retrievedData)) {
                retrievedData = [retrievedData];
            }
            for (let fields of retrievedData) {
                if ('LC' === fields['sources']['s']) {
                    data.set('Field of activity', fields['text']);
                }
            }
        }
        if (UriDereferencer.isset(() => json['occupation']['data'])) {
            const occupations = [];
            for (let occupation of json['occupation']['data']) {
                if ('LC' === occupation['sources']['s']) {
                    occupations.push(occupation['text']);
                }
            }
            if (occupations.length) {
                data.set('Occupation', occupations.join('; '));
            }
        }
        if (UriDereferencer.isset(() => json['birthDate'])) {
            data.set('Birth date', json['birthDate']);
        }
        if (UriDereferencer.isset(() => json['deathDate'])) {
            data.set('Death date', json['deathDate']);
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            if (null !== value) {
                dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`;
            }
        }
        return `<p><strong>Een term uit <a target="uri-dereference" href="${uri}">Virtual International Authority File (VIAF) van OCLC</a></strong></p><dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/(?:www\.)?viaf\.org\/viaf\/(.+?)\/?(?:#.+)?$/);
    }
});
UriDereferencer.addService({
    getName() {
        // http://fast.oclc.org/
        return 'OCLC FAST';
    },
    getOptions() {
        // Must use the proxy because responses sent from OCLC FAST don't
        // include an Access-Control-Allow-Origin header.
        return {'useProxy': true};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `http://id.worldcat.org/fast/${match[1]}/rdf.xml`;
    },
    getMarkup(uri, text) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const data = new Map();
        data.set('Pref label', this.getNodeText(xmlDoc, `//rdf:Description/skos:prefLabel`));
        data.set('Alt label', this.getNodeText(xmlDoc, `//rdf:Description/skos:altLabel`));
        let dataMarkup = '';
        for (let [key, value] of data) {
            if (null !== value) {
                dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`;
            }
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/id\.worldcat\.org\/fast\/(.+)$/);
    },
    getNodeText(xmlDoc, xpathExpression) {
        const namespaceResolver = function(prefix) {
            const ns = {
                'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                'skos': 'http://www.w3.org/2004/02/skos/core#',
            };
            return ns[prefix] || null;
        };
        const texts = [];
        const xpathResult = xmlDoc.evaluate(xpathExpression, xmlDoc, namespaceResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let thisNode = xpathResult.iterateNext();
        while (thisNode) {
            texts.push(thisNode.textContent);
            thisNode = xpathResult.iterateNext();
        }
        return texts.join('; ');
    }
});
UriDereferencer.addService({
    getName() {
        // https://www.rdaregistry.info/termList/
        return 'RDA Value Vocabularies';
    },
    getOptions() {
        return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        // Note that the resource URL is a graph of every concept.
        const match = this.getMatch(uri);
        return `http://rdaregistry.info/termList/${match[1]}.jsonld`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const canonicalUri = `http://rdaregistry.info/termList/${match[1]}/${match[2]}`;
        const json = JSON.parse(text);
        const data = new Map();
        for (let concept of json['@graph']) {
            if (canonicalUri === concept['@id']) {
                if (UriDereferencer.isset(() => concept['prefLabel']['en'])) {
                    data.set('Pref label', concept['prefLabel']['en']);
                }
                if (UriDereferencer.isset(() => concept['altLabel']['en'])) {
                    data.set('Alt label', concept['altLabel']['en']);
                }
                if (UriDereferencer.isset(() => concept['definition']['en'])) {
                    data.set('Definition', concept['definition']['en']);
                }
                break;
            }
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            if (null !== value) {
                dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`;
            }
        }
        return `<dl>${dataMarkup}</dl>`;
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/(?:www\.)?rdaregistry\.info\/termList\/(.+)\/#?(.+)$/);
    }
});
UriDereferencer.addService({
    getName() {
        // https://www.gemeentegeschiedenis.nl/
        return 'Gemeentegeschiedenis'; // Dutch municipal history
    },
    getOptions() {
		return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://www.gemeentegeschiedenis.nl/gemeentenaam/json/${match[1]}`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();		
		Object.keys(json).forEach(function(key) {
		  if (key!="geometries" && key!="uri" && json[key]!="null" && typeof json[key] === 'string') {
			if (json[key].startsWith("http")) {
				data.set(key, `<a href="${json[key]}">${json[key]}</a>`); 
			} else {
				data.set(key, json[key]);
			}
		    
		  }
		})
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
	    return '<p><strong>Een term uit <a target="uri-dereference" href="'+uri+'">'+ this.getName()+ '</a>:</strong></p><dl>'+dataMarkup+'</dl>';
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/www\.gemeentegeschiedenis\.nl\/gemeentenaam\/(.*)/);
    }
});
UriDereferencer.addService({
    getName() {
        // http://data.bibliotheken.nl/doc/dataset/persons
        return 'Nederlandse Thesaurus van Auteursnamen (NTA)';
    },
    getOptions() {
		return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://data.bibliotheken.nl/doc/thes/${match[1]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();		
		
		var graphIndex=0;
		for(var i=0;i<json["@graph"].length;i++) {
			if (json["@graph"][i]["@id"].includes("id/thes/")) {
				graphIndex=i;
			}
		}
		Object.keys(json["@graph"][graphIndex]).forEach(function(key) {
			if (!json["@graph"][graphIndex][key].toString().startsWith("_:")) { // skip de blank nodes
				data.set(key, json["@graph"][graphIndex][key]);
			}
		})
        let dataMarkup = '';
        for (let [key, value] of data) {
			if (!key.startsWith("@")) {
				dataMarkup += `<dt>${key}</dt><ul>`
				if (typeof value === 'object') {
					Object.keys(value).forEach(function(key) {
						dataMarkup += '<li>'
						if (value[key]['@id']) {
							let uri=value[key]['@id'];
							dataMarkup += `<a href="${uri}">${uri}</a><br>`
						} else {
							if (value[key]['@value']) {
								dataMarkup += `${value[key]["@value"]}`
								if (value[key]['@language']) {
									dataMarkup += ` (${value[key]["@language"]})`
								}
							} else {	
								if (value[key].startsWith("http")) {
									dataMarkup += `<a href="${value[key]}">${value[key]}</a>`
								} else {
									dataMarkup += `${value[key]}`
								}
							}
						}
						dataMarkup += '</li>'
					})
				} else {
					dataMarkup += `<li>${value}</li>`
				}
				dataMarkup += `</ul>`
			}
        }
		
		return '<p><strong>Een term uit de <a target="uri-dereference" href="'+uri+'">'+ this.getName()+ '</a>:</strong></p><dl>'+dataMarkup+'</dl><br>';
    },
    getMatch(uri) {
        return uri.match(/^http?:\/\/data\.bibliotheken\.nl\/id\/thes\/(.*)/);
    }
});
UriDereferencer.addService({
    getName() {
        return 'Het Biografisch Portaal';
    },
    getOptions() {
		return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://http2https.coret.org/http://www.biografischportaal.nl/persoon/json/${match[1]}`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        let dataMarkup = '';

		if (json.event.length>0) {
			Object.keys(json.event).forEach(function(key) {
				if (json.event[key].type=="birth" && json.event[key].when!=null) {
					dataMarkup += `<dt>Gedoopt</dt><dd>${json.event[key].when}`
					if (json.event[key].place!=null) {
						dataMarkup += ` (${json.event[key].place})`
					}
					dataMarkup += '</dd>'
				}
				if (json.event[key].type=="birth" && json.event[key].when!=null) {
					dataMarkup += `<dt>Geboren</dt><dd>${json.event[key].when}`
					if (json.event[key].place!=null) {
						dataMarkup += ` (${json.event[key].place})`
					}
					dataMarkup += '</dd>'
				}
				if (json.event[key].type=="death" && json.event[key].when!=null) {
					dataMarkup += `<dt>Overleden</dt><dd>${json.event[key].when}`
					if (json.event[key].place!=null) {
						dataMarkup += ` (${json.event[key].place})`
					}
					dataMarkup += '</dd>'
				}
				if (json.event[key].type=="funeral" && json.event[key].when!=null) {
					dataMarkup += `<dt>Begraven</dt><dd>${json.event[key].when}`
					if (json.event[key].place!=null) {
						dataMarkup += ` (${json.event[key].place})`
					}
					dataMarkup += '</dd>'
				}
			})
        }
	
		if (typeof json.figures === 'object' && json.figures.length>0) {
			dataMarkup += '<dt>Afbeelding(en)</dt><dd>'
			Object.keys(json.biographies).forEach(function(key) {
				if(json.figures[key]) { 
					dataMarkup += `<img src="${json.figures[key].url}" title="${json.figures[key].head}">`
				}
			})
			dataMarkup += '</dd>'
		}

		if (json.biographies.length>0) {
			dataMarkup += `<dt>Biografie(ën)</dt><ul>`
			Object.keys(json.biographies).forEach(function(key) {
				dataMarkup += `<li><a href="${json.biographies[key].url_biography}">${json.biographies[key].publisher}</a></li>`
			})
			dataMarkup += `</ul>`
        }
		return '<p><strong>Een term uit het <a target="uri-dereference" href="'+uri+'">'+ this.getName()+ '</a>:</strong></p><dl>'+dataMarkup+'</dl><br>';
    },
    getMatch(uri) {
        return uri.match(/^http?:\/\/www\.biografischportaal\.nl\/persoon\/(.*)/);
    }	
});
UriDereferencer.addService({
    getName() {
        return 'Nederlandse Bibliografie Totaal (NBT) van de KB, nationale bibliotheek';
    },
    getOptions() {
		return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://data.bibliotheken.nl/doc/nbt/${match[1]}.json`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
		
		var graphIndex=0;
		for(var i=0;i<json["@graph"].length;i++) {
			if (json["@graph"][i]["@id"].includes("id/nbt/")) {
				graphIndex=i;
				break;
			}
		}
        let dataMarkup = '';
		dataMarkup += '<dt>Label</dt><div class="value">'+json["@graph"][graphIndex]["label"]+'</div>';
		dataMarkup += '<dt>Beschrijving</dt><div class="value">'+json["@graph"][graphIndex]["description"]+'</div>';
		if (json["@graph"][graphIndex]["sameAs"]) {
			dataMarkup += '<dt>Zelfde als</dt><div class="value"><a target="uri-dereference" href="'+json["@graph"][graphIndex]["sameAs"]+'">'+json["@graph"][graphIndex]["sameAs"]+'</a></div>';
		} else {
			if (json["@graph"][graphIndex]["schema:sameAs"]) {
				dataMarkup += '<dt>Zelfde als</dt><div class="value"><a  target="uri-dereference" href="'+json["@graph"][graphIndex]["schema:sameAs"]+'">'+json["@graph"][graphIndex]["schema:sameAs"]+'</a></div>';
			} 
		}
		
        return '<p><strong>Een term uit de <a target="uri-dereference" href="'+uri+'">'+ this.getName()+ '</a>:</strong></p><dl>'+dataMarkup+'</dl>';
    },
    getMatch(uri) {
        return uri.match(/^http?:\/\/data\.bibliotheken\.nl\/id\/nbt\/(.*)/);
    }
});
UriDereferencer.addService({
    getName() {
        return 'Cultural Heritage Thesaurus (CHT) van Rijksdienst voor het Cultureel Erfgoed (RCE)';
    },
    getOptions() {
        return {'useProxy': true};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        const match = this.getMatch(uri);
        return `https://data.cultureelerfgoed.nl/term/id/cht/${match[1]}.rdf`;
    },
    getMarkup(uri, text) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const data = new Map();
        data.set('Beschrijving', this.getNodeText(xmlDoc, `//rdf:Description/skos:scopeNote`));
        data.set('Alternatieve labels', this.getNodeText(xmlDoc, `//rdf:Description/skos:altLabel`));
        let dataMarkup = '';
        for (let [key, value] of data) {
            if (null !== value) {
                dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`;
            }
        }
        return '<p><strong>Een term uit de <a target="uri-dereference" href="'+uri+'">'+ this.getName()+ '</a>:</strong></p><dl>'+dataMarkup+'</dl>';
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/data.cultureelerfgoed.nl\/term\/id\/cht\/(.+)$/);
    },
    getNodeText(xmlDoc, xpathExpression) {
        const namespaceResolver = function(prefix) {
            const ns = {
                'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                'skos': 'http://www.w3.org/2004/02/skos/core#',
            };
            return ns[prefix] || null;
        };
        const texts = [];
        const xpathResult = xmlDoc.evaluate(xpathExpression, xmlDoc, namespaceResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let thisNode = xpathResult.iterateNext();
        while (thisNode) {
            texts.push(thisNode.textContent);
            thisNode = xpathResult.iterateNext();
        }
        return texts.join('; ');
    }
});
UriDereferencer.addService({
    getName() {
        return 'RKDartists';
    },
    getOptions() {
		return {};
    },
    isMatch(uri) {
        return (null !== this.getMatch(uri));
    },
    getResourceUrl(uri) {
        // Note that Getty doesn't enable cross-origin resource sharing (CORS),
        // so we can't directly fetch the JSON representations. Use the SPARQL
        // endpoint instead.
        const match = this.getMatch(uri);
        const sparql = `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX la: <https://linked.art/ns/terms/>
SELECT ?label ?birthPlace ?birthYear ?deathPlace ?deathYear ?link WHERE {
  OPTIONAL {
    <https://data.rkd.nl/artists/82385> crm:P98i_was_born/crm:P7_took_place_at/crm:P89_falls_within ?bornPlace .
    ?bornPlace skos:prefLabel ?birthPlace.
    FILTER (lang(?birthPlace) = 'nl')
  }
  OPTIONAL {
    <https://data.rkd.nl/artists/82385> crm:P98i_was_born/crm:P4_has_time-span/crm:P82a_begin_of_the_begin ?birthYear .
  }
  OPTIONAL {
    <https://data.rkd.nl/artists/82385> crm:P100i_died_in/crm:P7_took_place_at/crm:P89_falls_within ?diedPlace.
    ?diedPlace skos:prefLabel ?deathPlace.
    FILTER (lang(?deathPlace) = 'nl')
  }
  OPTIONAL {
    <https://data.rkd.nl/artists/82385> crm:P100i_died_in/crm:P4_has_time-span/crm:P82a_begin_of_the_begin ?deathYear.
  }
  <https://data.rkd.nl/artists/82385> crm:P129i_is_subject_of/la:access_point ?link.
}`;
        return `https://api.rkd.triply.cc/datasets/rkd/RKD-Knowledge-Graph/services/SPARQL/sparql?query=${encodeURIComponent(sparql)}`;
    },
    getMarkup(uri, text) {
        const match = this.getMatch(uri);
        const json = JSON.parse(text);
        const data = new Map();
		if (UriDereferencer.isset(() => json[0]['birthPlace'])) {
            data.set('Geboorteplaats', json[0]['birthPlace']);
        }
        if (UriDereferencer.isset(() => json[0]['birthYear'])) {
            data.set('Geboortejaar', json[0]['birthYear']);
        }
        if (UriDereferencer.isset(() => json[0]['deathPlace'])) {
            data.set('Overlijdensplaats', json[0]['deathPlace']);
        }
        if (UriDereferencer.isset(() => json[0]['deathYear'])) {
            data.set('Overlijdensjaar', json[0]['deathYear']);
        }
		if (UriDereferencer.isset(() => json[0]['link'])) {
            data.set('Hetzelde als', '<a href="'+json[0]['link']+'" target=_blank>'+json[0]['link']+'</a>');
        }
        let dataMarkup = '';
        for (let [key, value] of data) {
            dataMarkup += `<dt>${key}</dt><dd>${value}</dd>`
        }
		return '<p><strong>Een term uit <a target="uri-dereference" href="'+uri+'">'+ this.getName()+ '</a>:</strong></p><dl>'+dataMarkup+'</dl><br>';
    },
    getMatch(uri) {
        return uri.match(/^https?:\/\/data\.rkd\.nl\/artists\/(.*)/);
    }
});