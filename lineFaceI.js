    lineFaceI = (X1, Y1, Z1, X2, Y2, Z2, facet, showNormals=false) => {
      let I_=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
      let R_ = (Rl,Pt,Yw)=>{
        let M=Math, A=M.atan2, H=M.hypot
        X=S(p=A(X,Y)+Rl)*(d=H(X,Y)),Y=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d
      }
      let rotSwitch = m =>{
        switch(m){
          case 0: R_(0,0,Math.PI/2); break
          case 1: R_(0,Math.PI/2,0); break
          case 2: R_(Math.PI/2,0,Math.PI/2); break
        }        
      }
      let ax = 0, ay = 0, az = 0
      facet.map(q_=>{ ax += q_[0], ay += q_[1], az += q_[2] })
      ax /= facet.length, ay /= facet.length, az /= facet.length
      let b1 = facet[1][0]-facet[0][0], b2 = facet[1][1]-facet[0][1], b3 = facet[1][2]-facet[0][2]
      let c1 = facet[2][0]-facet[1][0], c2 = facet[2][1]-facet[1][1], c3 = facet[2][2]-facet[1][2]
      let crs = [b2*c3-b3*c2,b3*c1-b1*c3,b1*c2-b2*c1]
      let d = Math.hypot(...crs)+.001
      let nls=2 //normal line length
      crs = crs.map(q=>q/d*nls)
      let X1_ = ax, Y1_ = ay, Z1_ = az
      let X2_ = ax + crs[0], Y2_ = ay + crs[1], Z2_ = az + crs[2]
      if(showNormals){
        x.beginPath()
        X = X1_, Y = Y1_, Z = Z1_
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
        X = X2_, Y = Y2_, Z = Z2_
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
        stroke('#f00','',.5,true)
      }
      let p1_ = Math.atan2(X2_-X1_,Z2_-Z1_)
      let p2_ = -(Math.acos((Y2_-Y1_)/(Math.hypot(X2_-X1_,Y2_-Y1_,Z2_-Z1_)+.001))+Math.PI/2)
      let isc = false, iscs = [false,false,false]
