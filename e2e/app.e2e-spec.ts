import { RxJsApiPage } from './app.po';

describe('rx-js-api App', function() {
  let page: RxJsApiPage;

  beforeEach(() => {
    page = new RxJsApiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
