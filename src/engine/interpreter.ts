import { Interpreter, Lexer, Parser } from 'ga-lang';

export function interpret(source: string): string {
  const lexer = new Lexer(source);
  const tokens = lexer.readTokens();

  const parser = new Parser(tokens);
  const stmts = parser.parse();

  const interpreter = new Interpreter();
  return interpreter.interpretForBrowser(stmts);
}
