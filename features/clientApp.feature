Feature: Client App Order Flow

  Background:
    Given the user navigates to the login page

  @Web
  Scenario Outline: Place an order with valid credentials - <userEmail>
    When the user logs in with "<userEmail>" and "<password>"
    Then the products page should be loaded

    When the user adds "<productName>" to the cart
    And the user goes to the cart
    Then the product "<productName>" should be visible in the cart

    When the user proceeds to checkout
    And the user fills payment details with card "1234 5678 9012 3456", month "12", year "16", cvv "123", name "Marie Valencia" and coupon "cuoupon"
    And the user selects country "India"
    And the user places the order

    Then a success message "Thankyou for the order." should be displayed
    And the order should appear in My Orders

    Examples:
      | userEmail                    | password          | productName     |
      | marie.valencia@example.com   | Password123@      | ZARA COAT 3     |
      | test33222@gmail.com          | WxYV@7j7Zup3!iH   | ADIDAS ORIGINAL |
