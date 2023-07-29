import React, { useState,useEffect } from "react";
import Timer from "../../components/Timer";
import Modal from "../../components/Modal";

import {
  ArrowDownIcon,
  QuestionIcon,
  ArrowDownIcon2,
  ArrowUpIcon,
} from "../../assets/Icons";

import {useNetwork,  useSwitchNetwork } from 'wagmi'

import ConfirmationPopup from "../../components/confirmationPopup";
import Web3 from "web3";
import { useAccount, useDisconnect } from 'wagmi'
import {stake3_address,stake2_3_abi,token_abi,Stake3_token_Address } from "../../components/config";
import { useContractReads,useContractRead ,useContractWrite, usePrepareContractWrite,useWaitForTransaction } from 'wagmi'


const stake3_Contract = {
  address: stake3_address,
  abi: stake2_3_abi,
}
const stakeTokem_Contract = {
  address: Stake3_token_Address,
  abi: token_abi,
}



const ThirdBox = ({
  headerTabsList,
  selectedTab3,
  setSelectedTab3,
  boxNumb,
  setBoxNumb,
  tokensList,
  hide7,
  setHide7,
  hide8,
  setHide8,
  token7,
  setToken7,
  token8,
  setToken8,
}) => {



  let count=0;
  const networkId=80001;

  const APRList = [
    { value: "0", lbl: "365 Days" ,APR: "550%" },
    { value: "1", lbl: "120 Days"  ,APR: "230%" },
    { value: "2", lbl: "90 Days"  ,APR: "180%" },
    { value: "3", lbl: "60 Days"  ,APR: "130%" },
    { value: "4", lbl: "30 Days" ,APR: "80%"  },
    { value: "5", lbl: "7 Days"  ,APR: "30%" },



  ];
  const [ selectedAPR,set_selectedAPR] = useState(APRList[0])
  const [hideTime, set_hideTime] = useState(false);
  const [expend, setExpend] = useState(false);
  const [open, setOpen] = useState(false);
  const [totalReward, set_totalReward] = useState(0);
  const [Total_withdraw, set_Total_withdraw] = useState(0);

  const [stakeAmount, setStakedAmount] = useState(0);
  const [curr_time, set_currTime] = useState(0);

  const [choosed_Unstake_inv, set_choosed_Unstake_inv] = useState();
  const [allInvestments, set_investmentList] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const { chain } = useNetwork()


  const { address, isConnecting ,isDisconnected} = useAccount()
  // const { disconnect } = useDisconnect()

  // console.log(typeOf(address));

  const { data:stakeResult, isLoading:isLoading_stake, isSuccess:stakeSuccess, write:staking } = useContractWrite({

    address: stake3_address,
  abi: stake2_3_abi,
  functionName: 'Stake',
  args: [stakeAmount*10**18,selectedAPR.value],
  value:Convert_To_Wei ((stakeAmount*0.3/100)),
  onSuccess(data) {
    test();
    console.log('Success', data)
  },


})



const { config:appConfig } = usePrepareContractWrite({
  address: Stake3_token_Address,
  abi: token_abi,
    functionName: 'approve',
    args: [stake3_address,stakeAmount*10**18],
})



    const { config:unstakeConfig } = usePrepareContractWrite({
      address: stake3_address,
      abi: stake2_3_abi,
      functionName: 'unStake',
      args: [choosed_Unstake_inv],
    
    })


    const { config:claimRewardConfig } = usePrepareContractWrite({
      address: stake3_address,
      abi: stake2_3_abi,
      functionName: 'withdrawReward',
    
    })

    const {data:data_app, isLoading:isLoading_app, isSuccess:isSuccess_app,write: approval} = useContractWrite(appConfig)

  const { data:data__unstake, isLoading:isLoading_unstake, isSuccess:isSuccess_unstake, write:unstake } = useContractWrite(unstakeConfig)


  const { data:stakeResult_withdrawReward, isLoading2_withdrawReward, isSuccess2_withdrawReward, write:withdrawReward } = useContractWrite(claimRewardConfig)
  const waitForTransaction = useWaitForTransaction({
    hash: data_app?.hash,
    onSuccess(data) {
    // alert("its run")
    staking?.()
      console.log('Success',data )
    },
  })



  const waitForTransaction2 = useWaitForTransaction({
    hash: stakeResult?.hash,
    onSuccess(data) {
    test?.()
      console.log('Success2',data )
    },
  })

  const waitForTransaction3 = useWaitForTransaction({
    hash: data__unstake?.hash,
    onSuccess(data) {
    test?.()
      console.log('Success2',data )
    },
  })

  const waitForTransaction4 = useWaitForTransaction({
    hash: stakeResult_withdrawReward?.hash,
    onSuccess(data) {
    test?.()
      console.log('Success2',data )
    },
  })



useEffect(()=>{
  if(count==0&& address!=undefined)
  {
      test()
      count++;
  }

},address)
  const { data, isError1, isLoading1 } = useContractReads({
    contracts: [
      {
        ...stake3_Contract,
        functionName: 'Apy',
      },
      {
        ...stake3_Contract,
        functionName: 'getTotalInvestment',

      },
      {
        ...stake3_Contract,
        functionName: 'get_currTime',
        
      },

      {
        ...stake3_Contract,
        functionName: 'owner',
        
      },
      {
        ...stake3_Contract,
        functionName: 'totalusers',
        
      },
      {
        ...stake3_Contract,
        functionName: 'totalbusiness',
        
      },
      {
        ...stake3_Contract,
        functionName: 'user',
        args:[address]
        
      },
      {
        ...stake3_Contract,
        functionName: 'get_withdrawnTime',
        args: [1]
        
      },





      {
        ...stakeTokem_Contract,
        functionName: 'balanceOf',
        args: [address]
        
      },
      
      
      

    ],
  })


  const {switchNetwork:stake_switch } =
    useSwitchNetwork({
      chainId: networkId,
      // throwForSwitchChainNotSupported: true,
      onSuccess(){

        approval?.()
      }

    })
    const { switchNetwork:unstake_switch } =
    useSwitchNetwork({
      chainId: networkId,
      // throwForSwitchChainNotSupported: true,
      onSuccess(){

        unstake?.()
      }

    })
    const { chains, error, isLoading, pendingChainId, switchNetwork:reward_switch } =
    useSwitchNetwork({
      chainId: networkId,
      // throwForSwitchChainNotSupported: true,
      onSuccess(){

        withdrawReward?.()
      }

    })


  
  async function test(){
    const web3= new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai.g.alchemy.com/v2/tJeV2dJPtzoWZgLalzn380ynAKIWX9FM"));
  
              
   const balance =await  web3.eth.getBalance(address)
    const contract=new web3.eth.Contract(stake2_3_abi,stake3_address);
    let curr_time = await contract.methods.get_currTime().call();    
    set_currTime(curr_time);

    let totalReward = await contract.methods.get_TotalReward().call({ from: address });       
    let Total_withdraw = await contract.methods.total_withdraw_reaward().call({ from: address });       

    let allInvestments = await contract.methods.getAll_investments().call({from: address});
             console.log("bal "+allInvestments);

    set_investmentList(allInvestments);
    setSelectedAmount(allInvestments[0]);
    set_totalReward(totalReward);
    set_Total_withdraw(Total_withdraw);



  }  
// function Max()
// {


// }
 function Convert_To_Wei( val){
  const web3= new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai.g.alchemy.com/v2/tJeV2dJPtzoWZgLalzn380ynAKIWX9FM"));
  val= web3.utils.toWei(val.toString(),"ether");
  return val;

}

function Convert_To_eth( val){
  const web3= new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai.g.alchemy.com/v2/tJeV2dJPtzoWZgLalzn380ynAKIWX9FM"));
  val= web3.utils.fromWei(val.toString(),"ether");
  return val;

}

  function stake()
  {
    if(isDisconnected)
    {
      alert("kindly connect your wallet ");
      return;
    }
    if(stakeAmount==0 )
    {
      alert("kindly write amount to stake ");
      return;
    }
    let fee= (stakeAmount*0.3)/(100)
    fee=fee*10**18;

    if(Number(data[8].result) < Number(fee))
    {
      alert("You dont have enough balance");
      return;
    }

    console.log((stakeAmount*0.3/100) );
    if(chain.id!=networkId)
    {
      stake_switch?.();
    }else{
      approval?.()

    }

  }
  

  function unstaking()
  {
    if(isDisconnected)
    {
      alert("kindly connect your wallet ");
      return;
    }
    console.log("object unstake "+choosed_Unstake_inv);
    // if(stakeAmount==0 )
    // {
    //   alert("kindly write amount to stake ");
    //   return;
    // }


    // if(Number(data[10].result) < Number(fee))
    // {
    //   alert("You dont have enough balance");
    //   return;
    // }
    if(chain.id!=networkId)
    {
      unstake_switch?.();
    }else{
      unstake?.()

    }    console.log(data__unstake);
    

  }

  function ClaimReward()
  {
    if(isDisconnected)
    {
      alert("kindly connect your wallet ");
      return;
    }
    console.log("object withdraw "+choosed_Unstake_inv);
    // if(stakeAmount==0 )
    // {
    //   alert("kindly write amount to stake ");
    //   return;
    // }


    // if(Number(data[10].result) < Number(fee))
    // {
    //   alert("You dont have enough balance");
    //   return;
    // }
    if(chain.id!=networkId)
    {
      reward_switch?.();
    }else{
      withdrawReward?.()

    }    

  }




















  const BodyBottom = () => {
    return (
      <div className="body-bottom flex flex-col w-full">
        <div className="expend-tab flex items-center justify-center">
          <div
            className="btn-expend flex items-center justify-center cursor-pointer"
            onClick={(e) => setExpend(!expend)}
          >
            <h1 className="e-tag mr-2">{expend ? "Hide" : "Detail"}</h1>
            <div className="e-icon flex items-center justify-center">
              {expend ? <ArrowUpIcon /> : <ArrowDownIcon2 />}
            </div>
          </div>
        </div>
        <div className={`expend-detail flex flex-col ${expend ? "show" : ""}`}>
          {/* <div className="detail-item flex items-center justify-between">
            <div className="lbl-side">Total Liquidity:</div>
            <div className="val-side" >                 
            $60,327971

                  
                  </div>
          </div> */}
          <div className="detail-item flex items-center justify-between">
            <div className="lbl-side"></div>
            <div className="val-side">
            <a
                    href="https://www.plutus.exchange/whitepaper"
                    target="_blank"
                    className="sub-menu-item"
                    style={{ color:"#2498A3" }}
                  >
                    Get KORE/WBTC
                  </a>
              
              </div>
          </div>

          <div className="detail-item flex items-center justify-between">
            <div className="lbl-side"></div>
            <div className="val-side">
            <a
                    href="https://www.plutus.exchange/whitepaper"
                    target="_blank"
                    className="sub-menu-item"
                    style={{ color:"#2498A3" }}
                  >
                    View Contract
                  </a>
              
              
              </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="grid-box flex flex-col">
      <div className="box-header flex items-center">
        {headerTabsList.map((item, index) => (
          <div
            key={index}
            className={`header-item flex items-center justify-center ${
              (selectedTab3 === item.title) & (boxNumb === 3) ? "active" : ""
            }`}
            onClick={(e) => {
              setSelectedTab3(item.title);
              setBoxNumb(3);
            }}
          >
            <h1 className="item-tag flex items-center justify-center">
              {item.title}
            </h1>
          </div>
        ))}
      </div>
      {selectedTab3 === "Stake" ? (
        <div
          className={`box-body flex flex-col ${boxNumb === 3 ? "active" : ""}`}
          onClick={(e) => {
            setSelectedTab3("Stake");
            setBoxNumb(3);
          }}
        >
          {boxNumb !== 3 && <div className="overlay" />}
          <div className="body-top flex items-center justify-between">
            <img src="/images/kore-wbtc.png" className="img" />
            <h1 className="top-tag">KORE/WBTC</h1>
          </div>
          <div className="body-meta flex flex-col justify-between h-full">
            <div className="flex flex-col">
              <div className="info-list flex flex-col">
                <div className="info-item flex items-center justify-between">
                  <h1 className="item-lbl text-white">Lock-up Period:</h1>
                  <h1 className="item-lbl text-white">45 days</h1>
                </div>
                <div className="info-item flex items-center justify-between">
                  <h1 className="item-lbl text-white">APY:</h1>
                  <h1 className="item-lbl text-white">{selectedAPR.APR}</h1>
                </div>
                <div className="info-item flex items-center justify-between">
                  <h1 className="item-lbl text-white">
                    Emergency Unstaking Penalties:
                  </h1>
                  <h1 className="item-lbl text-white">10%</h1>
                </div>
              </div>
              <div className="input-field flex flex-col">
                  <div className="field-hdr flex items-center justify-between">
                    <h1 className="f-tag" style={{ fontSize:12, paddingTop:10 }} >Choose Lock Period:</h1>
                  </div>
                  <div className="dropDown flex items-center justify-center flex-col relative">
                    <div className="category flex items-center">
                      <div
                        className="cbox cleanbtn flex items-center relative pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          set_hideTime(!hideTime);
                        }}
                      >
                        <div className="slt flex items-center">
                          {/* <div className="icon flex items-center justify-center">
                            <img
                              src={token1 ? token1.img : "/images/btc.png"}
                              className="img"
                            />
                          </div> */}
                          <div className="unit-name flex aic font s14 b4">
                            <span
                              className="unit-eng flex aic font s14 b4 "
                              placeholder="Plano" style={{ color:"white" }} 
                            >
                              {selectedAPR ? selectedAPR.lbl : ""}
                            </span>
                          </div>
                        </div>

                        <div className="arrow-icon flex items-center justify-center">
                          <ArrowDownIcon />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`block flex aic abs ${hideTime ? "show" : ""}`}
                    >
                      <div className="manue flex aic col anim">
                        {APRList.map((item, index) => (
                          <div
                            key={index}
                            className="slt flex aic"
                            onClick={(e) => {
                              set_hideTime(!hideTime);
                              // setToken1(item);
                              set_selectedAPR(item)
                            }}
                          >
                            <div className="unit-name flex aic font s14 b4">
                              <span className="unit-eng flex aic font s14 b4">
                                {item.lbl}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div> 
              <div className="input-form flex flex-col">
                <div className="input-field flex flex-col">
                  <div className="field-hdr flex items-center justify-between">
                    <h1 className="f-tag">Select Amount:</h1>
                    <h1 className="f-tag">
                    Balance: <span className="font-semibold">{data?(Number(data[8].result)/10**18).toFixed(2):0} PLP</span>
                    </h1>
                  </div>
                  <div className="field-i-box flex items-center">
                    <input
                      type="number"
                      className="txt cleanbtn w-full"
                      placeholder="Amount"
                      min={0}
                      value={stakeAmount}
                      max={data?(Number(data[8].result)/10**18):0}
                      onChange={(e)=>setStakedAmount(e.target.value)}
                    />
                    <div className="ib-right flex items-center">
                      <h1 className="ib-txt">PLP</h1>
                      <button className="ib-btn button" onClick={(e)=>setStakedAmount((Number(data[8].result)/10**18))} >Max</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button disabled={isLoading_app || isLoading_stake } className="btn-stack button" onClick={stake}> 
                 {!isLoading_stake  && !isLoading_app &&! isSuccess_app && !stakeSuccess &&<div>Approve</div>}
                  {isLoading_app && <div>Approving</div>}
                  {!stakeSuccess && !isLoading_stake && isSuccess_app && <div>Approved</div>}
                  {isLoading_stake && <div>Staking</div>}
                  {!isLoading_app && stakeSuccess && <div>Approve</div>}
                  </button>           </div>
          <BodyBottom />
        </div>
      ) : selectedTab3 === "Unstake" ? (
        <div
          className={`box-body flex flex-col ${boxNumb === 3 ? "active" : ""}`}
          onClick={(e) => {
            setSelectedTab3("Unstake");
            setBoxNumb(3);
          }}
        >
          {boxNumb !== 3 && <div className="overlay" />}
          <div className="body-top flex items-center justify-between">
          <img src="/images/kore-wbtc.png" className="img" />
            <h1 className="top-tag">KORE/WBTC</h1>
          </div>
          <div className="body-meta flex flex-col justify-between h-full">
            <div className="flex flex-col">
              <div className="info-list flex flex-col">
                <div className="info-item flex items-center justify-between">
                  <h1 className="item-lbl text-white">Penalty:</h1>
                  <h1 className="item-lbl text-red-600">10%</h1>
                </div>
              </div>
              <div className="input-form flex flex-col">
                <div className="input-field flex flex-col">
                  <div className="field-hdr flex items-center justify-between">
                    <h1 className="f-tag">Previous Investment:</h1>
                  </div>
                  <div className="dropDown flex items-center justify-center flex-col relative">
                    <div className="category flex items-center">
                      <div
                        className="cbox cleanbtn flex items-center relative pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHide7(!hide7);
                        }}
                      >
                        <div className="slt flex items-center">
                          <div className="unit-name flex items-center font s14 b4">
                            <span
                              className="unit-eng flex items-center font s14 b4"
                              placeholder="Plano"
                            >
                                 {selectedAmount
                                      ? selectedAmount[0]/10**18
                                      : "0"}                             
                                       </span>
                          </div>
                        </div>

                        <div className="arrow-icon flex items-center justify-center">
                          <ArrowDownIcon />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`block flex aic abs ${hide7 ? "show" : ""}`}
                    >
                      <div className="manue flex aic col anim">
                        {allInvestments.map((item, index) => (
                          <div
                            key={index}
                            className="slt flex aic"
                            onClick={(e) => {
                              setHide7(!hide7);
                              setToken7(item);
                              setSelectedAmount(item);
                              set_choosed_Unstake_inv(item[3])
                              console.log("its item "+item);
                            }}
                          >
                            <div className="unit-name flex aic font s14 b4">
                              <span className="unit-eng flex aic font s14 b4">
                              {Number(item[0])/10**18}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Timer time={selectedAmount ? Number(selectedAmount[1]): 0} />
                </div>
              </div>
            </div>
            {
              selectedAmount?(
                <button className="btn-stack button" disabled={isLoading_unstake} onClick={(e) =>{selectedAmount && Number(curr_time)>Number(selectedAmount[1])?(setOpen(true)):unstaking()} }>
                  {!isLoading_unstake  && !isSuccess_unstake &&<div>Unstake</div>}
                  {isLoading_unstake && !isSuccess_unstake && <div>Loading...</div>}
                  {!isLoading_unstake && isSuccess_unstake && <div>Unstake</div>}

              </button>




              ):(
                <button className="btn-stack button">
                Unstake
              </button>
              )

            }
          </div>
          <BodyBottom />
        </div>
      ) : selectedTab3 === "Reward" ? (
        <div
          className={`box-body flex flex-col ${boxNumb === 3 ? "active" : ""}`}
          onClick={(e) => {
            setSelectedTab3("Reward");
            setBoxNumb(3);
          }}
        >
          {boxNumb !== 3 && <div className="overlay" />}
          <div className="body-top flex items-center justify-between">
          <img src="/images/kore-wbtc.png" className="img" />
            <h1 className="top-tag">KORE/WBTC</h1>
          </div>
          <div className="body-meta flex flex-col justify-between h-full">
            <div className="flex flex-col">
              <div className="info-list flex flex-col">
                <div className="info-item flex items-center justify-between">
                  <h1 className="item-lbl text-white">Total Earnings</h1>
                  <h1 className="item-lbl text-white">{((Number(Total_withdraw)+Number(totalReward))/10**18).toFixed(2)}</h1>
                </div>
                <div className="info-item flex items-center justify-between">
                  <h1 className="item-lbl text-white">Available for claim:</h1>
                  <h1 className="item-lbl text-white">{(Number(totalReward)/10**18).toFixed(2)}</h1>
                </div>
              </div>
              <div className="input-form flex flex-col">
                <div className="input-field flex flex-col">
                  <div className="field-hdr flex items-center justify-between">
                    <h1 className="f-tag">Previous Investment:</h1>
                  </div>
                  <div className="dropDown flex items-center justify-center flex-col relative">
                    <div className="category flex items-center">
                      <div
                        className="cbox cleanbtn flex items-center relative pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHide8(!hide8);
                        }}
                      >
                        <div className="slt flex items-center">
                          <div className="unit-name flex items-center font s14 b4">
                            <span
                              className="unit-eng flex items-center font s14 b4"
                              placeholder="Plano"
                            >
                                 {selectedAmount
                                      ? selectedAmount[0]/10**18
                                      : "0"}   
                                                                  </span>
                          </div>
                        </div>

                        <div className="arrow-icon flex items-center justify-center">
                          <ArrowDownIcon />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`block flex aic abs ${hide8 ? "show" : ""}`}
                    >
                      <div className="manue flex aic col anim">
                        {allInvestments.map((item, index) => (
                          <div
                            key={index}
                            className="slt flex aic"
                            onClick={(e) => {
                              setHide8(!hide8);
                              setSelectedAmount(item);
                            }}
                          >
                            <div className="unit-name flex aic font s14 b4">
                              <span className="unit-eng flex aic font s14 b4">
                              {Number(item[0])/10**18}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="field-hdr flex items-center justify-end">
                    <h1 className="f-tag">
                      Earning : <span className="c-theme">{selectedAmount?(selectedAmount[6]/10**18).toFixed(2):0}</span>
                    </h1>
                  </div>
                </div>
                {/* <div className="input-field flex flex-col">
                  <div className="field-hdr flex items-center justify-between">
                    <h1 className="f-tag">Claim Reward:</h1>
                  </div>
                  <div className="field-i-box flex items-center">
                    <input
                      type="text"
                      className="txt cleanbtn w-full"
                      placeholder="Amount"
                    />
                    <div className="ib-right flex items-center">
                      <button className="ib-btn button">Max</button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <button className="btn-stack button" onClick={ClaimReward}>            
                  {!isLoading2_withdrawReward  && !isSuccess2_withdrawReward &&<div>Claim</div>}
                  {isLoading2_withdrawReward && !isSuccess2_withdrawReward && <div>Loading...</div>}
                  {!isLoading2_withdrawReward && isSuccess2_withdrawReward && <div>Claim</div>} 
                  </button>
          </div>
          <BodyBottom />
        </div>
      ) : null}
        <Modal open={open} onClose={() => setOpen(false)}>
          <ConfirmationPopup setOpen={setOpen} unstaking={unstaking}/>
        </Modal>
    </div>
  );
};

export default ThirdBox;
