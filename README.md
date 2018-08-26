# jquery.three-tier-cascade-selector
> A jQuery plugin for three tiers cascade selector.

## Features
- Support IE8+
- Good scalability, provide multiple custom properties

## Usage
```html
<input type="text" class="test">
<div class="cas-container"></div>

<link rel="stylesheet" href="./cascade.css">
<script src="./cascade.min.js"></script>

<script>
$('.cas-container').cascader({
      data: res.data, 
      callback: function(data){
          var fullAddress = '';
          for(var i=0; i< data.length; i++){
              fullAddress = fullAddress + data[i] + ' '
          }
          $('.test').val(fullAddress)
      }
  })
</script>

```

## API
|Property	        |                       	Description		                        |		  Type	      |      Default      |  
|:---------------:|:-------------------------------------------------------------:|:---------------:|:-----------------:|
|data		          | data options of cascade				                                | 	  array	      |         -         | 
|multiple         |	whether the third tiers of content allows multiple selections	| 	 boolean	    |       false       |   
|position         |	left scrollbar position, can be one of `top` `default`      	| 	  string	    |      default      |   
|speed		        | left scrollbar scrolling speed			                          | 	  number	    |         0         |
|backgroundColor	| customized background color of options		                    | 	  string	    |      '#ccc'       |    
|backBtnText	| customized text of return	button	                    | 	  string	    |      'back'       |    
|size		          | size. can be one of `large` `small`	 				                  | 	  string	    |      large        |
|callback	        |	callback when finishing cascader select				                | function(data)  |         -         |

