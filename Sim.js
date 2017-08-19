/*
 * Sim 코드를 JavaScript 코드로 컴파일합니다.
 * 
 * TODO: SON 처리
 */
global.Sim = METHOD((m) => {
	
	const SPECIAL_CHARS = '~`!#$%^&*+=-[]\\\';,/{}|":<>?';
	
	let parseValue = (valueContent, tabCount) => {
		
		// string
		if (valueContent[0] === '\'') {
			
			return '"' + RUN(() => {
				
				let ret = '';
				let nowTabCount = 0;
				
				valueContent = valueContent.substring(1, valueContent.length - 1).trim();
				
				EACH(valueContent, (ch, i) => {
					
					if (nowTabCount !== -1) {
						if (ch === '\t') {
							nowTabCount += 1;
							if (nowTabCount === tabCount + 1) {
								nowTabCount = -1;
							}
						} else {
							nowTabCount = -1;
						}
					}
					
					if (nowTabCount === -1) {
						
						if (ch === '\r' || (ch === '\\' && valueContent[i + 1] === '\'')) {
							// ignore.
						} else if (ch === '"') {
							ret += '\\"';
						} else if (ch === '\n') {
							ret += '\\n';
							nowTabCount = 0;
						} else {
							ret += ch;
						}
					}
				});
				
				return ret;
				
			}) + '"';
		}
		
		// array
		else if (valueContent[0] === '[') {
			
			return '[' + RUN(() => {
				
				let content = valueContent.substring(1, valueContent.length - 1).trim();
				let lastIndex = 0;
				let isStringMode;
				let arrayLevel = 0;
				let v = '';
				let ret = '';
				
				EACH(content, (ch, i) => {
					
					if (isStringMode !== true && ch === '[') {
						arrayLevel += 1;
					}
					
					else if (isStringMode !== true && ch === ']') {
						arrayLevel -= 1;
					}
					
					else if (ch === '\'' && content[i - 1] !== '\\') {
						if (isStringMode === true) {
							isStringMode = false;
						} else {
							isStringMode = true;
						}
					}
					
					else if (isStringMode !== true && arrayLevel === 0 && ch === ',') {
						
						v = parseValue(content.substring(lastIndex, i).trim(), tabCount);
						
						if (v !== '') {
							ret += v + ', ';
						}
						
						lastIndex = i + 1;
					}
				});
				
				if (isStringMode === true) {
					SHOW_ERROR('SON', 'parse error.');
				}
				
				else if (arrayLevel !== 0) {
					SHOW_ERROR('SON', 'parse error.');
				}
				
				else {
					ret += parseValue(content.substring(lastIndex).trim(), tabCount);
				}
				
				return ret;
				
			}) + ']';
		}
		
		// boolean, number
		else if (valueContent === 'true' || valueContent === 'false' || isNaN(valueContent) !== true) {
			return valueContent;
		}
		
		else {
			
			REPEAT(tabCount, () => {
				valueContent = '\t' + valueContent;
			});
			
			return parseSON(valueContent, tabCount);
		}
	}
	
	let parseSON = (content, tabCount) => {
		
		let json = '';
		
		let subContent = '';
		let lastIndex = 0;
		
		let isStringMode;
		let arrayLevel = 0;
		
		let parseLine = (line) => {
			
			let nowTabCount = 0;
			EACH(line, (ch) => {
				if (ch === '\t') {
					nowTabCount += 1;
				} else {
					return false;
				}
			});
			
			if (line.trim() !== '') {
				
				// 탭 수가 같으면 여기까지의 내용을 해석
				if (nowTabCount === tabCount) {
					
					let valueContent;
					
					if (subContent !== '') {
						json += (subContent.trim()[0] === '(' ? parse(subContent, tabCount).trim() : parseSON(subContent, tabCount + 1)) + ',\n';
						subContent = '';
					}
					
					REPEAT(tabCount, () => {
						json += '\t';
					});
					
					line = line.trim();
					
					// find name.
					json += '"';
					EACH(line, (ch, i) => {
						if (ch === ' ' || ch === '\t') {
							valueContent = line.substring(i).trim();
							return false;
						}
						json += ch;
					});
					json += '": ';
					
					// parse value content.
					if (valueContent !== undefined) {
						
						// 함수인 경우
						if (valueContent[0] === '(') {
							
							REPEAT(tabCount, () => {
								subContent += '\t';
							});
							
							subContent += valueContent + '\n';
						}
						
						else {
							json += parseValue(valueContent, tabCount + 1) + ',\n';
						}
					}
				}
				
				else {
					subContent += line + '\n';
				}
			}
		};
		
		EACH(content, (ch, i) => {
			
			// 배열
			if (isStringMode !== true && ch === '[') {
				arrayLevel += 1;
			} else if (isStringMode !== true && ch === ']') {
				arrayLevel -= 1;
			}
			
			// 문자열
			else if (ch === '\'' && content[i - 1] !== '\\') {
				if (isStringMode === true) {
					isStringMode = false;
				} else {
					isStringMode = true;
				}
			}
			
			// 배열도 문자열도 아닌 경우 한 줄 해석
			else if (isStringMode !== true && arrayLevel === 0 && ch === '\n') {
				parseLine(content.substring(lastIndex, i));
				lastIndex = i + 1;
			}
		});
		
		// 아직 문자열 모드인 경우
		if (isStringMode === true) {
			SHOW_ERROR('SON', 'parse error.');
		}
		
		// 아직 배열 모드인 경우
		else if (arrayLevel !== 0) {
			SHOW_ERROR('SON', 'parse error.');
		}
		
		// 아직 남아있는 내용이 있는 경우
		else {
			parseLine(content.substring(lastIndex));
		}
		
		if (subContent !== '') {
			json += (subContent.trim()[0] === '(' ? parse(subContent, tabCount).trim() : parseSON(subContent, tabCount + 1)) + '\n';
		} else {
			json = json.substring(0, json.length - 2) + '\n';
		}
		
		REPEAT(tabCount - 1, () => {
			json += '\t';
		});
		
		return '{\n' + json + '}';
	};
	
	let parseExpression = (expression) => {
		
		let jsCode = '';
		
		let isStringMode;
		let isCommentMode;
		
		let nowMode;
		let token = '';
		
		let appendToken = (mode, ch) => {
			
			if (nowMode !== mode) {
				
				if (nowMode === 'comment') {
					jsCode += '// ' + token;
				} else if (nowMode === 'string') {
					jsCode += '\'' + token + '\'';
				} else {
					
					if (token === '==') {
						token = '===';
					}
					
					jsCode += token;
				}
				
				nowMode = mode;
				
				token = '';
			}
			
			token += ch;
		};
		
		EACH(expression, (ch, i) => {
			
			// 문자열
			if (isCommentMode !== true && ch === '\'' && expression[i - 1] !== '\\') {
				
				if (isStringMode === true) {
					isStringMode = false;
				} else {
					isStringMode = true;
				}
			}
			
			// 주석
			else if (isStringMode !== true && ch === '#') {
				isCommentMode = true;
			}
			
			// 배열도 문자열도 주석도 아닌 경우
			else {
				
				// 주석
				if (isCommentMode === true) {
					appendToken('comment', ch);
				}
				
				// 문자열
				else if (isStringMode === true) {
					appendToken('string', ch);
				}
				
				// 공백
				else if (ch === ' ' || ch === '\t' || ch === '\r') {
					appendToken('space', ch);
				}
				
				// 연산자
				else if (SPECIAL_CHARS.indexOf(ch) != -1) {
					appendToken('operator', ch);
				}
				
				// 토큰
				else {
					appendToken('var', ch);
				}
			}
		});
		
		jsCode += token;
		
		return jsCode;
	};
	
	let parse = (code, blockLevel, isInFunc) => {
		
		let jsCode = '';
		let lines = [];
		
		RUN(() => {
			
			let lastIndex = 0;
			
			let isStringMode;
			let arrayLevel = 0;
			let isCommentMode;
			let isSONMode;
			
			let sonBlockLevel = 0;
			
			EACH(code, (ch, i) => {
				
				// 배열
				if (isStringMode !== true && isCommentMode !== true && isSONMode !== true && ch === '[') {
					arrayLevel += 1;
				} else if (isStringMode !== true && isCommentMode !== true && isSONMode !== true && ch === ']') {
					arrayLevel -= 1;
				}
				
				// 문자열
				else if (isCommentMode !== true && isSONMode !== true && ch === '\'' && code[i - 1] !== '\\') {
					if (isStringMode === true) {
						isStringMode = false;
					} else {
						isStringMode = true;
					}
				}
				
				// 주석
				else if (isStringMode !== true && ch === '#') {
					isCommentMode = true;
				}
				
				// 배열도 문자열도 아닌 경우 한 줄 해석
				else if (isStringMode !== true && arrayLevel === 0 && ch === '\n') {
					
					let line = code.substring(lastIndex, i);
					if (line.trim() !== '') {
						lines.push(line);
					}
					
					if (line.trim().substring(line.length - 2) === ' =') {
						
						isSONMode = true;
						
						sonBlockLevel = 0;
						EACH(line, (ch) => {
							if (ch === '\t') {
								sonBlockLevel += 1;
							} else {
								return false;
							}
						});
					}
					
					else if (isSONMode === true) {
						
						let nowBlockLevel = 0;
						EACH(line, (ch) => {
							if (ch === '\t') {
								nowBlockLevel += 1;
							} else {
								return false;
							}
						});
						
						if (nowBlockLevel === sonBlockLevel) {
							isSONMode = false;
						}
					}
					
					lastIndex = i + 1;
					
					isCommentMode = false;
				}
			});
			
			// 아직 문자열 모드인 경우
			if (isStringMode === true) {
				SHOW_ERROR('Sim', 'parse error.');
			}
			
			// 아직 배열 모드인 경우
			else if (arrayLevel !== 0) {
				SHOW_ERROR('Sim', 'parse error.');
			}
			
			// 아직 남아있는 코드가 있는 경우
			else {
				let line = code.substring(lastIndex);
				if (line.trim() !== '') {
					lines.push(line);
				}
			}
		});
		
		RUN(() => {
			
			let subCode = '';
			
			let isFuncMode;
			let isSONMode;
			
			EACH(lines, (line, i) => {
				
				let nowBlockLevel = 0;
				EACH(line, (ch) => {
					if (ch === '\t') {
						nowBlockLevel += 1;
					} else {
						return false;
					}
				});
				
				if (line.trim() !== '') {
					
					// 블록 레벨이 같으면 여기까지의 코드를 해석
					if (nowBlockLevel === blockLevel) {
						
						if (subCode !== '') {
							
							// SON 파싱
							if (isSONMode === true) {
								jsCode += ' ' + parseSON(subCode, blockLevel + 1);
							} else {
								jsCode += (isFuncMode === true ? ' =>' : '') + ' {\n' + parse(subCode, blockLevel + 1, isFuncMode) + '\n';
								REPEAT(blockLevel, () => {
									jsCode += '\t';
								});
								jsCode += '}\n';
							}
							
							subCode = '';
						}
						
						isFuncMode = false;
						isSONMode = false;
						
						REPEAT(blockLevel, () => {
							jsCode += '\t';
						});
						
						line = line.trim();
						
						if (line[line.length - 1] === ')') {
							isFuncMode = true;
						} else if (line[line.length - 1] === '(' || line.substring(line.length - 2) === ' =') {
							isSONMode = true;
						}
						
						// 주석
						if (line[0] === '#') {
							// 무시한다.
						}
						
						// let
						else if (line.substring(0, 4) === 'let ') {
							jsCode += 'let ' + parseExpression(line.substring(4));
						}
						
						// if
						else if (line.substring(0, 3) === 'if ') {
							jsCode += 'if (' + parseExpression(line.substring(3)) + ')';
						}
						
						// else
						else if (line === 'else' || line.substring(0, 5) === 'else ') {
							
							jsCode += 'else ';
							
							line = line.substring(5);
							
							// else if
							if (line.substring(0, 3) === 'if ') {
								jsCode += 'if (' + parseExpression(line.substring(3)) + ')';
							}
						}
						
						// for
						else if (line.substring(0, 4) === 'for ') {
							jsCode += 'for (' + parseExpression(line.substring(4)) + ')';
						}
						
						// 기타
						else {
							jsCode += (isInFunc === true && i === lines.length - 1 ? 'return ' : '') + parseExpression(line);
						}
					}
					
					else {
						subCode += line + '\n';
					}
				}
			});
			
			if (subCode !== '') {
				
				// SON 파싱
				if (isSONMode === true) {
					jsCode += ' ' + parseSON(subCode, blockLevel + 1);
				} else {
					jsCode += (isFuncMode === true ? ' =>' : '') + ' {\n' + parse(subCode, blockLevel + 1, isFuncMode) + '\n';
					REPEAT(blockLevel, () => {
						jsCode += '\t';
					});
					jsCode += '}\n';
				}
			}
			
			REPEAT(blockLevel, () => {
				jsCode += '\t';
			});
		});
		
		return jsCode;
	};
	
	return {
		
		run : (code) => {
			//REQUIRED: code
			
			return parse(code, 0);
		}
	};
});
