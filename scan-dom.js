function scanSite(){
	/*
		# Scan Website
		-----------------------------------------------------------------------
		An encapsulating function which runs the scanDOM() on each site on a
		page when given routes.
		=======================================================================
	*/
	
	/* Elements */
	let routes = [
		"en-US/docs/Web/API/Window/getComputedStyle",
		"en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
		"en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search"
	];
	let domain =  getDomainName();
	
	/* Methods */
	
	// Window Navigation
	function tokenizeUrl( url ){
		// Tokenizes a URL into an array of parts.
		return url.split(/[(://)(/)]/).filter( token =>  token !== "");
	};
	
	function getPageUrl(){
		// Get the current page's url.
		return document.location.href;
	};
	
	function getDomainName(){
		/* 
			Gets a URL protocol and domain name, like 
			`https://developer/mozilla.org/`
		*/
		return tokenizeUrl(getPageUrl()).slice(0,2).join("://");
	};
	
	function goToUrl( url ){
		// Navigate to the given url
		window.location.href = url;
		return;
	};
	
	function scanDOM(){
		/*
			# Scan DOM
			-----------------------------------------------------------------------
			An encapsulating function which performs a scan on the entire DOM of a 
			website, traversing between all the routes provided. It will create a 
			list of each DOM element that has a unique tag & class-list 
			combination, which it will then output once done.
			-----------------------------------------------------------------------
			* Originally was _the_ encapsulating function. Has remaining function
			definitions inside it, even though that causes run-time inefficacies,
			from previous implementation.
			=======================================================================
		*/
		
		/* Elements */
		var uniqueElements = {};
		
		/* Methods */
		
		// URL Manipulation
		function getPageUrl(){
			// Get the current page's url.
			return document.location.href;
		};
		
		// DOM Parsing
		function getPageRootElement(){
			// Gets the root of a page DOM.
			return document.documentElement;
		};
		
		function getElementTag( element ){
			// Gets the tag name for a DOM element.
			return element.tagName.toLowerCase();
		};
		
		function getElementClasses( element ){
			// Gets the class list of a DOM element.
			return element.classList;
		};
		
		function getElementChildren( element ){
			// Get an array of the children of an element
			return [...element.children];
		};
		
		function generateElementIdentifier( element ){
			/*
				Gets an element's identifier by combining it's tag and class-list 
				into a specially formatted string.
			*/
			return (`<${getElementTag(element)} classes='${getElementClasses(element)}'>`);
		};
		
		function getElementStyle( element ){
			// Gets the computed style for an element.
			return window.getComputedStyle(element);
		};
		
		function parseElement(element){
			// Parse each DOM element.
			
			// Get style info and add it if unique,
			let id = generateElementIdentifier(element);
			if(uniqueElements[id] === undefined){
				uniqueElements[id] = {
					id,
					style: getElementStyle(element),
				};
			};
			
			// Parse children nodes,
			getElementChildren(element).map( child => parseElement(child));
			
			// All done!
			return;
		};
		
		// Blob & File API
		function createBlobUrl( data, blobType ){
			/*
				Generates a Blob object from provided data, and then gets a URL to 
				the blob object for downloading.
			*/
			return window.URL.createObjectURL(new Blob([data], {type: blobType}));
		};
		
		function parseUrlToFilename( url ){
			// Transform a URL with `/` characters into a filename.
			return url.replace(/[(///:.)]/,"_");
		};
		
		function createBlobDownload( blobUrl, url ){
			/*
				Do some tricks to add a downloadable Blob file to the page!
			*/
			
			var blobLink = document.createElement("a");	// Create an anchor element.
			document.body.appendChild(blobLink);	// Append the anchor element to the document's body.
			blobLink.style = "display:none";	// Hide that link!
			blobLink.href = blobUrl;	// Set the href to the blob url!
			blobLink.download = `style-dom-blob-${parseUrlToFilename(url)}.json`;	// Set the downloaded blob's filename!
			blobLink.click();	// Click the anchor through JS! Should start downloading.
		};
		
		/* Run Code */
		parseElement(getPageRootElement());
		// console.log(uniqueElements);
		createBlobDownload(createBlobUrl(JSON.stringify(uniqueElements),"text/json"),getPageUrl());
	};
	
	function testCode(){
		let routes = [
			"https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle",
			"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
			"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search"
		];
		
		let i = 0;
		routes.forEach( route => {
			let fn = function(){
				window.location.href = route;
			};
			setTimeout(fn,(5000*i));
			i += 1;
		});
	};
	
	function parseSite(){
		// Run scanDOM() on each route.
		let i = 0;
		let j = 0;
		
		// For each route,
		routes.forEach( route => {
			window.setTimeout(function(){
				let currentUrl = `${domain}/${route}`;
				goToUrl(currentUrl);
				console.log(`Scanning ${currentUrl}... (${i+1}/${routes.length})`);
				scanDOM();
				i += 1;
			},(j*15000));
			j += 1;
		});

		console.log("Startig site scan...");	// Display a console message for the system to start scanning
		// Setup a message to display in the console once site scanning is done.
		window.setTimeout(function(){
			console.log("Scanning completed!");
		},((routes.length + 2)*15000));
	};
	
	/* Run Code */
	parseSite();	// Do the thing!
	
	return;
};