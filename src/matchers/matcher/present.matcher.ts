import { Matcher } from '../matcher.interface';

class PresentMatcher implements Matcher {
  public isSatisfiedBy(prefix, name) {
    return prefix === 'f' && name === 'isPresent';
  }

  public match(element) {
    return element
      .isPresent()
      .then(() => true)
      .catch(() => Promise.reject(`Matcher "PresentMatcher" could not find element "${element.locator()}".`));
  }
}

export const presentMatcher = new PresentMatcher();
