
import {expect, test} from '@playwright/test';
import { evaluateScript } from './utils/scripting';
import { login } from './utils/roles';
import Menu  from './utils/menu';
import Map  from './utils/map';
import { publicTestMapUrl } from './utils/urls';

test.describe('Availability Status', () => {
    test.describe('Busy Status',()=>{
        test('should return to online status when you move',async({ page, browser,browserName },{project})=>{
            // Skip webkit because the moving player with the keyboard doesn't work
            if(browserName === "webkit"){
                //eslint-disable-next-line playwright/no-skipped-test
               test.skip();
               return;
           }
            const statusName = "Busy";
            const isMobileTest = project.name === "mobilechromium";
    
            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US', isMobileTest);
            

            await Menu.openStatusList(page, isMobileTest);
            await Menu.clickOnStatus(page,statusName); 
            if((browserName === "firefox") && await page.getByText(`Do you want to allow notification`).isVisible() ){
                await  page.locator("section:has(#notificationPermission) + footer>button.outline").click();
            }
            await Menu.openStatusList(page, isMobileTest);
            await expect(page.getByText(statusName)).toHaveCSS('opacity','0.5')
        
        
            //move to trigger status change 
            await Map.walkTo(page,'ArrowRight',100)

            await expect(page.getByText("Online")).toHaveCSS('opacity','0.5')

        })
        test('should disable microphone and camera',async({ page, browser,browserName }, {project})=>{
            if(browserName === "webkit"){
                 //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            const statusName = "Busy";
            const isMobileTest = project.name === "mobilechromium";
    
            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US', isMobileTest);
            
              // Because webkit in playwright does not support Camera/Microphone Permission by settings


            await Menu.turnOnCamera(page);
            await Menu.turnOnMicrophone(page);

            //await Menu.closeNotificationPopUp(page);

            await Menu.openStatusList(page, isMobileTest);
            await Menu.clickOnStatus(page,statusName); 
            //await Menu.closeNotificationPopUp(page);

            await expect(page.getByAltText('Turn off webcam')).toBeHidden();
            await expect(page.getByAltText('Turn off microphone')).toBeHidden();
            

        })

        test('should keep same webcam and microphone config when you go back to online status',async({ page, browser,context,browserName },{project})=>{
            if(project.name === "mobilechromium" || browserName === "webkit") {
                //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            const statusName = "Busy";
    
            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US');

            await Menu.turnOnCamera(page);
            await Menu.turnOffMicrophone(page)


            await expect(page.getByAltText('Turn off webcam')).toBeVisible();
            await expect(page.getByAltText('Turn on microphone')).toBeVisible();

            await Menu.openStatusList(page);
            await Menu.clickOnStatus(page,statusName);
            //await Menu.closeNotificationPopUp(page);
            await Map.walkTo(page,'ArrowRight',100)

            await expect(page.getByAltText('Turn off webcam')).toBeVisible();
            await expect(page.getByAltText('Turn on microphone')).toBeVisible();
        })
        test('should ask to change notification permission when you pass in Busy status and your browser notification permission is denied',async({ page, browser,context,browserName}, {project})=>{
            if(browserName === "firefox" || browserName === "webkit"){
                //skip for firefox because of notification permission management
                //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            
            const statusName = "Busy";
            const isMobileTest = project.name === "mobilechromium";


            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US', isMobileTest);
            await Map.walkTo(page,'ArrowRight',500);

            await Menu.openStatusList(page, isMobileTest);
            await Menu.clickOnStatus(page,statusName);

            await expect(page.getByRole("button",{name:'continue without notification'})).toBeVisible();

            await page.getByText('continue without notification').click();

            await expect(page.locator('continue without notification')).toBeHidden();
        })
        
        test.describe('busy interaction',async()=>{
            test('should open a popup when a bubble is create...',async({ page, browserName,browser,context}, {project})=>{
                if(browserName === "webkit"){
                     //eslint-disable-next-line playwright/no-skipped-test
                    test.skip();
                    return;
                }
                const statusName = "Busy";
                const isMobileTest = project.name === "mobilechromium";
                await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
        
                await login(page, 'Alice', 2, 'en-US', isMobileTest);
                const positionToDiscuss = {
                    x: 3 * 32,
                    y: 4 * 32
                };
                await Map.teleportToPosition(page, positionToDiscuss.x, positionToDiscuss.y);
                
                const newBrowser = await browser.newContext();
                const userBob = await newBrowser.newPage();
            
                await userBob.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
               // Login user "Bob"
                const secondPageName = 'Bob'
                await login(userBob, secondPageName, 3, 'en-US', isMobileTest);
                
                await Menu.openStatusList(page, isMobileTest);
                await Menu.clickOnStatus(page,statusName); 
               // await Menu.closeNotificationPopUp(page);

                const isInBubble = evaluateScript(page, async () => {
                    return new Promise((resolve) => {
                        WA.player.proximityMeeting.onJoin().subscribe((user) => {
                            console.log("Entering proximity meeting with", user);
                            resolve(true)
                        });
                    });
                });


                await Map.teleportToPosition(userBob, positionToDiscuss.x+10, positionToDiscuss.y);
                
                if((browserName === "firefox") && await page.getByText(`Do you want to allow notification`).isVisible() ){
                    await  page.locator("section:has(#notificationPermission) + footer>button.outline").click();
                }

                await expect(page.getByText(`${secondPageName} wants to discuss with you`)).toBeVisible();
                await expect(await isInBubble).toBeTruthy();
                
                await newBrowser.close();

                
            })
            test('should return to online status after accept conversation',async({ page, browser,context,browserName}, {project})=>{
                if(browserName === "webkit"){
                     //eslint-disable-next-line playwright/no-skipped-test
                    test.skip();
                    return;
                }
                const statusName = "Busy";
                const isMobileTest = project.name === "mobilechromium";
                await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
        
                await login(page, 'Alice', 2, 'en-US', isMobileTest);

                const positionToDiscuss = {
                    x: 3 * 32,
                    y: 4 * 32
                };
                await Map.teleportToPosition(page, positionToDiscuss.x, positionToDiscuss.y);

                await Menu.openStatusList(page, isMobileTest);
                await Menu.clickOnStatus(page,statusName);
                //await Menu.closeNotificationPopUp(page);

                const newBrowser = await browser.newContext();
                const userBob = await newBrowser.newPage();

                await userBob.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
               // Login user "Bob"
                const secondPageName = 'Bob'
                await login(userBob, secondPageName, 3, 'en-US', isMobileTest);
                await Map.teleportToPosition(userBob, positionToDiscuss.x, positionToDiscuss.y);
                
                
                if((browserName === "firefox" ) && await page.getByText(`Do you want to allow notification`).isVisible() ){
                    await  page.locator("section:has(#notificationPermission) + footer>button.outline").click();
                }
                await expect(page.getByText(`${secondPageName} wants to discuss with you`)).toBeVisible();
                
                await page.locator('section:has(#acceptDiscussion) + footer>button.light').click();
                await Menu.openStatusList(page, isMobileTest);
                await expect(page.getByText("Online")).toHaveCSS('opacity','0.5')
                await newBrowser.close();
            })
            test('should keep busy status  after refuse conversation',async({ page, browser,browserName}, {project})=>{
                
                if(browserName === "webkit"){
                     //eslint-disable-next-line playwright/no-skipped-test
                    test.skip();
                    return;
                }

                const statusName = "Busy";
                const isMobileTest = project.name === "mobilechromium";
                await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
        
                await login(page, 'Alice', 2, 'en-US', isMobileTest);
                const positionToDiscuss = {
                    x: 3 * 32,
                    y: 4 * 32
                };
                await Map.teleportToPosition(page, positionToDiscuss.x, positionToDiscuss.y);

                await Menu.openStatusList(page, isMobileTest);
                await Menu.clickOnStatus(page,statusName); 
               // await Menu.closeNotificationPopUp(page);

                const newBrowser = await browser.newContext();
                const userBob = await newBrowser.newPage();

                await userBob.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
               // Login user "Bob"
                const secondPageName = 'Bob'
                await login(userBob, secondPageName, 3, 'en-US', isMobileTest);
                await Map.teleportToPosition(userBob, positionToDiscuss.x, positionToDiscuss.y);
                
                if((browserName === "firefox") && await page.getByText(`Do you want to allow notification`).isVisible() ){
                    await  page.locator("section:has(#notificationPermission) + footer>button.outline").click();
                }

                await expect(page.getByText(`${secondPageName} wants to discuss with you`)).toBeVisible();

                //click on close button
                await  page.locator("section:has(#acceptDiscussion) + footer>button.outline").click();
                await Menu.openStatusList(page, isMobileTest);
                await expect(page.getByText(statusName)).toHaveCSS('opacity','0.5')  

                await userBob.close();
                await newBrowser.close();
            })
        })

    })
    test.describe('Back in a moment Status',()=>{
        test('should return to online status when you move',async({ page, browser,browserName },{project})=>{
            // Skip webkit because the moving player with the keyboard doesn't work
            if(browserName === "webkit"){
                //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            const statusName = "Back in a moment";
            const isMobileTest = project.name === "mobilechromium";
    
            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US', isMobileTest);

            await Menu.openStatusList(page, isMobileTest);
            await Menu.clickOnStatus(page,statusName);

            await Menu.openStatusList(page, isMobileTest);
            
            await expect(page.getByText(statusName)).toHaveCSS('opacity','0.5')

            await Map.walkTo(page,'ArrowRight',100)

            await expect(page.getByText("Online")).toHaveCSS('opacity','0.5')

        })
        test('should disable microphone and camera',async({ page, browser,browserName }, {project})=>{
            const statusName = "Back in a moment";
            const isMobileTest = project.name === "mobilechromium";
            if(browserName === "webkit"){
                 //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US', isMobileTest);

            await Menu.turnOnCamera(page);
            await Menu.turnOnMicrophone(page);

            //await Menu.closeNotificationPopUp(page);

            await Menu.openStatusList(page, isMobileTest);
            await Menu.clickOnStatus(page,statusName); 
            //await Menu.closeNotificationPopUp(page);

            await expect(page.getByAltText('Turn off webcam')).toBeHidden();
            await expect(page.getByAltText('Turn off microphone')).toBeHidden();
        })

        test('should keep same webcam and microphone config when you go back to online status',async({ page, browser,context,browserName },{project})=>{
            if(project.name === "mobilechromium" || browserName === "webkit") {
                //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            const statusName = "Back in a moment";
    
            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US');
            
            await Menu.turnOnCamera(page);
            await Menu.turnOffMicrophone(page)

            await expect(page.getByAltText('Turn off webcam')).toBeVisible();
            await expect(page.getByAltText('Turn on microphone')).toBeVisible();

            await Menu.openStatusList(page);
            await Menu.clickOnStatus(page,statusName); 

            //move to trigger status change 
            await Map.walkTo(page,'ArrowRight',100)

            await expect(page.getByAltText('Turn off webcam')).toBeVisible();
            await expect(page.getByAltText('Turn on microphone')).toBeVisible();
        })
        test.describe('Back in a moment interaction',async()=>{
            test('should not create a bubble',async({ page, browser,context}, {project})=>{
                const statusName = "Back in a moment";
                const isMobileTest = project.name === "mobilechromium";
                await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
        
                await login(page, 'Alice', 2, 'en-US', isMobileTest);
                const positionToDiscuss = {
                    x: 3 * 32,
                    y: 4 * 32
                };
                await Map.teleportToPosition(page, positionToDiscuss.x, positionToDiscuss.y);
            
                await Menu.openStatusList(page, isMobileTest);
                await Menu.clickOnStatus(page,statusName); 

                const newBrowser = await browser.newContext();
                const userBob = await newBrowser.newPage();

                await userBob.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
               // Login user "Bob"
                const secondPageName = 'Bob'
                await login(userBob, secondPageName, 3, 'en-US', isMobileTest);
                await Map.teleportToPosition(userBob, positionToDiscuss.x, positionToDiscuss.y);
                await expect( page.locator('button.chat-btn + div>span.tw-animate-ping')).toBeHidden();
                await newBrowser.close();
            })
        })

    })
    test.describe('Do not disturb Status',()=>{
        test('should return to online status when you move',async({ page, browser,browserName },{project})=>{
            // Skip webkit because the moving player with the keyboard doesn't work
            if(browserName === "webkit"){
                //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            const statusName = "Do not disturb";
            const isMobileTest = project.name === "mobilechromium";
    
            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US', isMobileTest);
            
            await Menu.closeNotificationPopUp(page);
            await Menu.openStatusList(page, isMobileTest);
            await Menu.clickOnStatus(page,statusName);
            await page.waitForTimeout(500);

            await Menu.openStatusList(page, isMobileTest);
            await expect(page.getByText(statusName)).toHaveCSS('opacity','0.5')
        
            //move to trigger status change 
            await Map.walkTo(page,'ArrowRight',100)

            await expect(page.getByText("Online")).toHaveCSS('opacity','0.5')

        })
        test('should disable microphone and camera',async({ page, browser,browserName }, {project})=>{
            if(browserName === "webkit"){
                 //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            const statusName = "Do not disturb";
            const isMobileTest = project.name === "mobilechromium";

            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US', isMobileTest);

            await Menu.turnOnCamera(page);
            await Menu.turnOnMicrophone(page);

            //await Menu.closeNotificationPopUp(page);

            await Menu.openStatusList(page, isMobileTest);
            await Menu.clickOnStatus(page,statusName); 
            //await Menu.closeNotificationPopUp(page);

            await expect(page.getByAltText('Turn off webcam')).toBeHidden();
            await expect(page.getByAltText('Turn off microphone')).toBeHidden();
            

            

        })

        test('should keep same webcam and microphone config when you go back to online status',async({ page, browser,context,browserName },{project})=>{
            
            if(project.name === "mobilechromium" || browserName === "webkit") {
                //eslint-disable-next-line playwright/no-skipped-test
                test.skip();
                return;
            }
            const statusName = "Do not disturb";
    
            await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
    
            await login(page, 'Alice', 2, 'en-US');
        
            await Menu.turnOnCamera(page);
            await Menu.turnOffMicrophone(page)


            await expect(page.getByAltText('Turn off webcam')).toBeVisible();
            await expect(page.getByAltText('Turn on microphone')).toBeVisible();

            await Menu.openStatusList(page);
            await Menu.clickOnStatus(page,statusName); 

            //move to trigger status change 
            await Map.walkTo(page,'ArrowRight',100)

            await expect(page.getByAltText('Turn off webcam')).toBeVisible();
            await expect(page.getByAltText('Turn on microphone')).toBeVisible();
        })
        test.describe('Do not disturb interaction',async()=>{
            test('should not create a bubble ',async({ page, browser,context}, {project})=>{
                const statusName = "Do not disturb";
                const isMobileTest = project.name === "mobilechromium";
                await page.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
        
                await login(page, 'Alice', 2, 'en-US', isMobileTest);
                const positionToDiscuss = {
                    x: 3 * 32,
                    y: 4 * 32
                };
                await Map.teleportToPosition(page, positionToDiscuss.x, positionToDiscuss.y);
            
                await Menu.openStatusList(page, isMobileTest);
                await Menu.clickOnStatus(page,statusName); 

                const newBrowser = await browser.newContext();
                const userBob = await newBrowser.newPage();


                await userBob.goto(publicTestMapUrl("tests/E2E/empty.json", "availability-status"));
               // Login user "Bob"
                const secondPageName = 'Bob'
                await login(userBob, secondPageName, 3, 'en-US', isMobileTest);

                await Map.teleportToPosition(userBob, positionToDiscuss.x, positionToDiscuss.y);
                await expect( page.locator('button.chat-btn + div>span.tw-animate-ping')).toBeHidden();
                await newBrowser.close();
            })
        })
    })
})
