// flow-typed signature: bfd4c76f1ba49cd92cdde14562ac7b6a
// flow-typed version: 55f720db6c/selenium-webdriver_v3.x.x/flow_>=v0.42.x

// @flow

declare class webdriver$Capabilities {
	static android(): this;
	static chrome(): this;
	static edge(): this;
	static firefox(): this;
	static ie(): this;
	setScrollBehavior(behavior: number): this;
	setLoggingPrefs(prefs: webdriver$logging$Preferences): this;
}

declare class webdriver$Options {
	addCookie(spec: any): webdriver$Thenable;
	deleteAllCookies(): webdriver$Thenable;
	deleteCookie(name: string): webdriver$Thenable;
	getCookies(): webdriver$Thenable;
	getCookie(name: string): webdriver$Thenable;
	timeouts(): webdriver$Timeouts;
	window(): webdriver$Window;
	logs(): webdriver$Logs;
}

declare class webdriver$Logs {
	get(type: webdriver$logging$Type): webdriver$Thenable;
	getAvailableLogTypes(): webdriver$Thenable;
}

declare class webdriver$Window {
	maximize(): webdriver$Thenable;
	getSize(): webdriver$Thenable;
	setSize(width: number, height: number): webdriver$Thenable;
}

declare class webdriver$Timeouts {
	implicitlyWait(ms: number): webdriver$Thenable;
	setScriptTimeout(ms: number): webdriver$Thenable;
	pageLoadTimeout(ms: number): webdriver$Thenable;
}

declare class webdriver$Navigation {
	refresh(): webdriver$Thenable;
}

declare class webdriver$Builder {
	constructor(): this;
	withCapabilities(capabilities: webdriver$Capabilities): this;
	forBrowser(name: string, opt_version?: string, opt_platform?: string): this;

	// Added by AV on 4/7/2017
	usingServer(url: string): this;

	build(): webdriver$WebDriver;
}

declare class webdriver$WebDriver {
	close(): webdriver$Thenable;
	quit(): webdriver$Thenable;
	findElement(locator: webdriver$By|Function): webdriver$WebElementPromise;
	findElements(locator: webdriver$By|Function): webdriver$WebElementPromise;
	get(url: string): webdriver$Thenable;
	getTitle(): webdriver$Thenable;
	getCurrentUrl(): webdriver$Thenable;
	navigate(): webdriver$Navigation;
	manage(): webdriver$Options;
	executeScript(args: any): webdriver$Thenable;

	// Added by AV on 4/6/2017
	executeAsyncScript(args: any): any;

	takeScreenshot(): webdriver$Thenable;
	wait(condition: webdriver$Condition|Function, timeout: ?number, message: ?string): webdriver$Thenable;
	sleep(ms: number): webdriver$Thenable;
}

declare class webdriver$By {
	constructor(using: string, value: string): this;
	static className(name: string): this;
	static css(selector: string): this;
	static id(id: string): this;
	static linkText(text: string): this;
	static js(script: string, var_args: any): this;
	static name(name: string): this;
	static partialLinkText(text: string): this;
	static tagName(name: string): this;
	static xpath(xpath: string): this;
}

declare class webdriver$WebElement {
	getId(): webdriver$Thenable;
	click(): webdriver$Thenable;
	sendKeys(var_args: any): webdriver$Thenable;
}

declare class webdriver$WebElementPromise extends webdriver$WebElement {
	then(f: Function): this;
	catch(f: Function): this;
}

declare class webdriver$Thenable {
	then(f: Function): this;
	catch(f: Function): this;
}

declare class webdriver$Resolver {
	promise: webdriver$Thenable;
	fulfill(obj: any): void;
	reject(obj: any): void;
}

declare interface webdriver$promise {
	defer(): webdriver$Resolver;
	all(arr: Array<webdriver$Thenable>):webdriver$Thenable;
}

declare class webdriver$Condition {
}

declare interface webdriver$until {
	ableToSwitchToFrame(frame: number|webdriver$WebElement|webdriver$By|Function): webdriver$Condition;
	alertIsPresent(): webdriver$Condition;
	titleIs(title: string): webdriver$Condition;
	titleContains(substr: string): webdriver$Condition;
	titleMatches(regex: RegExp): webdriver$Condition;
	urlIs(url: string): webdriver$Condition;
	urlContains(substrUrl: string): webdriver$Condition;
	urlMatches(regex: RegExp): webdriver$Condition;
	elementLocated(locator: webdriver$By|Function): webdriver$Condition;
	elementsLocated(locator: webdriver$By|Function): webdriver$Condition;
	stalenessOf(element: webdriver$WebElement): webdriver$Condition;
	elementIsVisible(element: webdriver$WebElement): webdriver$Condition;
	elementIsNotVisible(element: webdriver$WebElement): webdriver$Condition;
	elementIsEnabled(element: webdriver$WebElement): webdriver$Condition;
	elementIsDisabled(element: webdriver$WebElement): webdriver$Condition;
	elementIsSelected(element: webdriver$WebElement): webdriver$Condition;
	elementIsNotSelected(element: webdriver$WebElement): webdriver$Condition;
	elementTextIs(element: webdriver$WebElement, text: string): webdriver$Condition;
	elementTextContains(element: webdriver$WebElement, substr: string): webdriver$Condition;
	elementTextMatches(element: webdriver$WebElement, regex: RegExp): webdriver$Condition;
}

declare type webdriver$Key = {
	NULL:         '',
	CANCEL:       '',
	HELP:         '',
	BACK_SPACE:   '',
	TAB:          '',
	CLEAR:        '',
	RETURN:       '',
	ENTER:        '',
	SHIFT:        '',
	CONTROL:      '',
	ALT:          '',
	PAUSE:        '',
	ESCAPE:       '',
	SPACE:        '',
	PAGE_UP:      '',
	PAGE_DOWN:    '',
	END:          '',
	HOME:         '',
	ARROW_LEFT:   '',
	LEFT:         '',
	ARROW_UP:     '',
	UP:           '',
	ARROW_RIGHT:  '',
	RIGHT:        '',
	ARROW_DOWN:   '',
	DOWN:         '',
	INSERT:       '',
	DELETE:       '',
	SEMICOLON:    '',
	EQUALS:       '',
	NUMPAD0:      '',
	NUMPAD1:      '',
	NUMPAD2:      '',
	NUMPAD3:      '',
	NUMPAD4:      '',
	NUMPAD5:      '',
	NUMPAD6:      '',
	NUMPAD7:      '',
	NUMPAD8:      '',
	NUMPAD9:      '',
	MULTIPLY:     '',
	ADD:          '',
	SEPARATOR:    '',
	SUBTRACT:     '',
	DECIMAL:      '',
	DIVIDE:       '',
	F1:           '',
	F2:           '',
	F3:           '',
	F4:           '',
	F5:           '',
	F6:           '',
	F7:           '',
	F8:           '',
	F9:           '',
	F10:          '',
	F11:          '',
	F12:          '',
	COMMAND:      '',
	META:         ''
}

declare class webdriver$logging$Type {
	BROWSER: webdriver$logging$Type;
	CLIENT: webdriver$logging$Type;
	DRIVER: webdriver$logging$Type;
	PERFORMANCE: webdriver$logging$Type;
	SERVER: webdriver$logging$Type;
}

declare class webdriver$logging$Level {
	OFF: webdriver$logging$Level;
	SEVERE: webdriver$logging$Level;
	WARNING: webdriver$logging$Level;
	INFO: webdriver$logging$Level;
	DEBUG: webdriver$logging$Level;
	FINE: webdriver$logging$Level;
	FINER: webdriver$logging$Level;
}

declare class webdriver$logging$Preferences {
	constructor(): this;
	setLevel(type: webdriver$logging$Type|string, level: webdriver$logging$Level|string|number): void;
	toJSON(): Object;
}

declare interface webdriver$logging {
	Type: webdriver$logging$Type;
	Level: webdriver$logging$Level;
	Preferences: Class<webdriver$logging$Preferences>;
}

declare module 'selenium-webdriver' {
	declare export var Key: webdriver$Key;
	declare export var Capabilities: Class<webdriver$Capabilities>;
	declare export var Options: Class<webdriver$Options>;
	declare export var Logs: Class<webdriver$Logs>;
	declare export var Window: Class<webdriver$Window>;
	declare export var Timeouts: Class<webdriver$Timeouts>;
	declare export var Navigation: Class<webdriver$Navigation>;
	declare export var Builder: Class<webdriver$Builder>;
    declare export var WebDriver: Class<webdriver$WebDriver>;
    declare export var By: Class<webdriver$By>;
    declare export var WebElement: Class<webdriver$WebElement>;
    declare export var WebElementPromise: Class<webdriver$WebElementPromise>;
	declare export var Thenable: Class<webdriver$Thenable>;

	declare export var until: webdriver$until;
	declare export var promise: webdriver$promise;
	declare export var logging: webdriver$logging;
}
