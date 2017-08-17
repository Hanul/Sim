/*
 * Sim 코드를 JavaScript 코드로 컴파일합니다.
 */
global.Sim = METHOD((m) => {
	
	let parseExpression = (expression) => {
		
		//console.log(expression);
		
		return expression;
	};
	
	let parse = (code, blockLevel, isInFunc) => {
		
		let jsCode = '';
		
		let subCode = '';
		let lastIndex = 0;
		
		let isStringMode;
		let arrayLevel = 0;
		
		let isLetMode;
		let isFuncMode;
		
		let lines = [];
		
		EACH(code, (ch, i) => {
			
			// 배열
			if (isStringMode !== true && ch === '[') {
				arrayLevel += 1;
			} else if (isStringMode !== true && ch === ']') {
				arrayLevel -= 1;
			}
			
			// 문자열
			else if (ch === '\'' && code[i - 1] !== '\\') {
				if (isStringMode === true) {
					isStringMode = false;
				} else {
					isStringMode = true;
				}
			}
			
			// 배열도 문자열도 아닌 경우 한 줄 해석
			else if (isStringMode !== true && arrayLevel === 0 && ch === '\n') {
				
				let p = code.substring(lastIndex, i);
				if (p.trim() !== '') {
					lines.push(p);
				}
				
				lastIndex = i + 1;
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
			let p = code.substring(lastIndex);
			if (p.trim() !== '') {
				lines.push(p);
			}
		}
		
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
						jsCode += (isFuncMode === true ? ' =>' : '') + ' {\n' + parse(subCode, blockLevel + 1, isFuncMode) + '\n}' + (isLetMode === true ? ';' : '') + '\n';
						subCode = '';
					}
					
					isLetMode = false;
					isFuncMode = false;
					
					REPEAT(blockLevel, () => {
						jsCode += '\t';
					});
					
					line = line.trim();
					
					if (line.substring(0, 4) === 'let ') {
						jsCode += 'let ' + parseExpression(line.substring(4));
						isLetMode = true;
					}
					
					else if (line.substring(0, 3) === 'if ') {
						jsCode += 'if (' + parseExpression(line.substring(3)) + ')';
					}
					
					else if (line === 'else' || line.substring(0, 5) === 'else ') {
						
						jsCode += 'else ';
						
						line = line.substring(5);
						
						// else if
						if (line.substring(0, 3) === 'if ') {
							jsCode += 'if (' + parseExpression(line.substring(3)) + ')';
						}
					}
					
					else if (line.substring(0, 4) === 'for ') {
						jsCode += 'for (' + parseExpression(line.substring(4)) + ')';
					}
					
					else {
						jsCode += (isInFunc === true && i === lines.length - 1 ? 'return ' : '') + parseExpression(line) + ';';
					}
					
					if (line.substring(line.length - 1) === ')') {
						isFuncMode = true;
					}
				}
				
				else {
					subCode += line + '\n';
				}
			}
		});
		
		if (subCode !== '') {
			jsCode += ' {\n' + parse(subCode, blockLevel + 1) + '\n}' + (isLetMode === true ? ';' : '') + '\n';
		}
		
		REPEAT(blockLevel, () => {
			jsCode += '\t';
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
